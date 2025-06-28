// lib/email.js
import nodemailer from 'nodemailer';

// Email service configuration
const EMAIL_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // Start with 1 second
  RATE_LIMIT: {
    DAILY: 300, // Brevo free tier limit
    HOURLY: 50  // Self-imposed hourly limit
  }
};

// Simple in-memory rate limiter (use Redis in production for multiple instances)
const emailTracker = {
  daily: new Map(),
  hourly: new Map()
};

// Rate limiting checker
function checkRateLimit(email) {
  const now = new Date();
  const hourKey = `${now.getHours()}-${now.getDate()}`;
  const dayKey = now.getDate().toString();

  // Check hourly limit
  const hourlyCount = emailTracker.hourly.get(hourKey) || 0;
  if (hourlyCount >= EMAIL_CONFIG.RATE_LIMIT.HOURLY) {
    throw new Error('Hourly email limit reached. Please try again later.');
  }

  // Check daily limit
  const dailyCount = emailTracker.daily.get(dayKey) || 0;
  if (dailyCount >= EMAIL_CONFIG.RATE_LIMIT.DAILY) {
    throw new Error('Daily email limit reached. Please try again tomorrow.');
  }

  // Update counters
  emailTracker.hourly.set(hourKey, hourlyCount + 1);
  emailTracker.daily.set(dayKey, dailyCount + 1);

  // Clean old entries
  if (emailTracker.daily.size > 7) {
    const oldestKey = Array.from(emailTracker.daily.keys())[0];
    emailTracker.daily.delete(oldestKey);
  }
}

// Create reusable transporter
const createTransporter = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Brevo configuration
  if (process.env.EMAIL_SERVICE === 'brevo' || isProduction) {
    if (!process.env.BREVO_SMTP_KEY) {
      console.error('⚠️ BREVO_SMTP_KEY not found in environment variables');
    }
    
    console.log('🔍 Email Configuration Check:', {
      service: process.env.EMAIL_SERVICE,
      host: 'smtp-relay.brevo.com',
      port: 587,
      user: process.env.BREVO_LOGIN_EMAIL,
      hasPassword: !!process.env.BREVO_SMTP_KEY,
      passwordLength: process.env.BREVO_SMTP_KEY?.length,
      from: process.env.EMAIL_FROM
    });
    
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.BREVO_LOGIN_EMAIL || process.env.EMAIL_FROM,
        pass: process.env.BREVO_SMTP_KEY
      },
      // Additional settings for better deliverability
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
      rateDelta: 1000,
      rateLimit: 5
    });
  }
  
  // Development fallback 
  if (process.env.NODE_ENV === 'development') {
    // Option 1: Mailtrap (recommended for development)
    // Sign up at https://mailtrap.io for free testing
    return nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.mailtrap.io',
      port: process.env.EMAIL_SERVER_PORT || 2525,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    });
  }

  // Fallback to console logging if everything fails 
  console.warn('⚠️ No email service configured, emails will be logged to console');
  return {
    sendMail: async (options) => {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
        preview: options.text?.substring(0, 100) + '...'
      });
      return { messageId: 'console-' + Date.now() };
    }
  };
};

// Retry logic with exponential backoff
async function sendEmailWithRetry(mailOptions, attempts = EMAIL_CONFIG.MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const transporter = createTransporter();
      
      // Verify connection before sending (only on first attempt)
      if (attempt === 1 && process.env.NODE_ENV === 'production') {
        await transporter.verify();
      }
      
      const info = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Email sent successfully on attempt ${attempt}:`, {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      
      return info;
    } catch (error) {
      lastError = error;
      console.error(`❌ Email send attempt ${attempt} failed:`, error.message);
      
      if (attempt < attempts) {
        const delay = EMAIL_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Email templates
const emailTemplates = {
  verification: (verificationUrl) => ({
    subject: 'Verify Your AeroLink Account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f3f4f6;
              color: #1f2937;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 40px 20px;
            }
            .card {
              background: white;
              border-radius: 16px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
              color: white;
              padding: 40px;
              text-align: center;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .content {
              padding: 40px;
            }
            .button {
              display: inline-block;
              padding: 16px 32px;
              background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 24px 0;
              text-align: center;
            }
            .footer {
              padding: 24px 40px;
              background: #f9fafb;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
            }
            .icon {
              width: 24px;
              height: 24px;
              display: inline-block;
              vertical-align: middle;
              margin-right: 8px;
            }
            .divider {
              height: 1px;
              background: #e5e7eb;
              margin: 32px 0;
            }
            .code {
              background: #f3f4f6;
              padding: 16px;
              border-radius: 8px;
              font-family: monospace;
              font-size: 14px;
              word-break: break-all;
              margin: 16px 0;
              border: 1px solid #e5e7eb;
            }
            @media (max-width: 600px) {
              .content, .header, .footer { padding: 24px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <div class="logo">
                  <img 
                    src="https://svgshare.com/i/14bK.svg" 
                    alt="AeroLink Logo" 
                    width="48" 
                    height="48" 
                    style="display: block; margin: 0 auto;" 
                  />
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Welcome to AeroLink</h1>
                <p style="margin: 16px 0 0 0; opacity: 0.9;">The future of autonomous delivery</p>
              </div>
              
              <div class="content">
                <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1f2937;">Verify Your Email Address</h2>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 16px 0;">
                  Thanks for signing up! We're excited to have you join our revolutionary drone delivery platform. 
                  Please verify your email address to activate your account and start experiencing the future of delivery.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${verificationUrl}" class="button" style="color: white;">
                    ✓ Verify Email
                  </a>
                </div>
                
                <div class="divider"></div>
                
                <p style="color: #6b7280; font-size: 14px; margin: 16px 0;">
                  If the button doesn't work, you can copy and paste this link into your browser:
                </p>
                
                <div class="code">
                  ${verificationUrl}
                </div>
                
                <div class="divider"></div>
                
                <div style="background: #f0f9ff; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="color: #0369a1; margin: 0; font-size: 14px;">
                    <strong>🔒 Security Note:</strong> This verification link expires in 24 hours. 
                    If you didn't create an account, please ignore this email.
                  </p>
                </div>
              </div>
              
              <div class="footer">
                <p style="margin: 0 0 8px 0;">
                  © 2025 AeroLink. All rights reserved.
                </p>
                <p style="margin: 0; font-size: 12px;">
                  Revolutionizing delivery with autonomous drone technology
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to AeroLink

Please verify your email address to activate your account:

${verificationUrl}

This link expires in 24 hours.

If you didn't create an account, please ignore this email.

© 2025 AeroLink. All rights reserved.
    `
  }),

  passwordReset: (resetUrl) => ({
    subject: '🔐 Reset Your DroneDelivery Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
          <style>
            /* Same styles as verification email */
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f3f4f6;
              color: #1f2937;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 40px 20px;
            }
            .card {
              background: white;
              border-radius: 16px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #dc2626 0%, #f87171 100%);
              color: white;
              padding: 40px;
              text-align: center;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .content {
              padding: 40px;
            }
            .button {
              display: inline-block;
              padding: 16px 32px;
              background: linear-gradient(135deg, #dc2626 0%, #f87171 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 24px 0;
              text-align: center;
            }
            .footer {
              padding: 24px 40px;
              background: #f9fafb;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
            }
            .code {
              background: #f3f4f6;
              padding: 16px;
              border-radius: 8px;
              font-family: monospace;
              font-size: 14px;
              word-break: break-all;
              margin: 16px 0;
              border: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <div class="logo">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Password Reset Request</h1>
              </div>
              
              <div class="content">
                <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1f2937;">Reset Your Password</h2>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 16px 0;">
                  We received a request to reset your password. Click the button below to create a new password.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${resetUrl}" class="button" style="color: white;">
                    🔐 Reset Password
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin: 16px 0;">
                  Or copy and paste this link:
                </p>
                
                <div class="code">
                  ${resetUrl}
                </div>
                
                <div style="background: #fef2f2; border-radius: 8px; padding: 16px; margin: 24px 0;">
                  <p style="color: #dc2626; margin: 0; font-size: 14px;">
                    <strong>⚠️ Important:</strong> This link expires in 1 hour. If you didn't request a password reset, 
                    please ignore this email and your password will remain unchanged.
                  </p>
                </div>
              </div>
              
              <div class="footer">
                <p style="margin: 0;">© 2024 DroneDelivery. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Password Reset Request

We received a request to reset your password. Visit the link below to create a new password:

${resetUrl}

This link expires in 1 hour.

If you didn't request a password reset, please ignore this email.

© 2024 DroneDelivery. All rights reserved.
    `
  }),

  deliveryNotification: (deliveryData) => ({
    subject: `🚁 Your Delivery #${deliveryData.orderId} is ${deliveryData.status}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Delivery Update</title>
          <style>
            /* Similar styles to above */
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; }
            .status-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
            }
            .in-transit { background: #fbbf24; color: #78350f; }
            .delivered { background: #34d399; color: #064e3b; }
            .tracking-steps {
              margin: 24px 0;
              padding: 0;
              list-style: none;
            }
            .tracking-step {
              display: flex;
              align-items: center;
              margin: 16px 0;
            }
            .step-icon {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: #e5e7eb;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 16px;
            }
            .step-icon.completed {
              background: #34d399;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Delivery Update</h1>
            <p>Your delivery #${deliveryData.orderId} is <span class="status-badge ${deliveryData.status}">${deliveryData.status}</span></p>
            
            <div class="tracking-steps">
              <div class="tracking-step">
                <div class="step-icon completed">✓</div>
                <div>
                  <strong>Order Placed</strong><br>
                  <small>${deliveryData.orderTime}</small>
                </div>
              </div>
              <div class="tracking-step">
                <div class="step-icon ${deliveryData.status !== 'pending' ? 'completed' : ''}">
                  ${deliveryData.status !== 'pending' ? '✓' : '2'}
                </div>
                <div>
                  <strong>Drone Assigned</strong><br>
                  <small>${deliveryData.droneId || 'Pending'}</small>
                </div>
              </div>
              <div class="tracking-step">
                <div class="step-icon ${deliveryData.status === 'delivered' ? 'completed' : ''}">
                  ${deliveryData.status === 'delivered' ? '✓' : '3'}
                </div>
                <div>
                  <strong>Delivered</strong><br>
                  <small>${deliveryData.estimatedDelivery}</small>
                </div>
              </div>
            </div>
            
            <p>
              <a href="${process.env.NEXTAUTH_URL}/tracking/${deliveryData.orderId}" 
                 style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">
                Track Delivery
              </a>
            </p>
          </div>
        </body>
      </html>
    `,
    text: `Your delivery #${deliveryData.orderId} is ${deliveryData.status}. Track at: ${process.env.NEXTAUTH_URL}/tracking/${deliveryData.orderId}`
  })
};

export async function sendVerificationEmail(email, token) {
  try {
    // Check rate limits
    checkRateLimit(email);
    
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
    const template = emailTemplates.verification(verificationUrl);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'AeroLink <rizzzaltamash@gmail.com>',
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
      // Brevo specific headers for better deliverability
      headers: {
        'X-Mailin-Tag': 'verification',
        'X-Priority': '1',
        'Importance': 'high'
      }
    };

    const info = await sendEmailWithRetry(mailOptions);
    
    return { 
      success: true, 
      messageId: info.messageId,
      preview: process.env.NODE_ENV === 'development' ? verificationUrl : undefined
    };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Add Sentry or other error tracking here
      console.error('Production email error:', {
        email: email.replace(/(?<=.{3}).(?=.*@)/g, '*'), // Partially mask email
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email, token) {
  const transporter = createTransporter();
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  const template = emailTemplates.passwordReset(resetUrl);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'AeroLink <rizzzaltamash@gmail.com>',
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html
    });

    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

// Send delivery notification
export async function sendDeliveryNotification(email, deliveryData) {
  const transporter = createTransporter();
  const template = emailTemplates.deliveryNotification(deliveryData);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'AeroLink <rizzzaltamash@gmail.com>',
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html
    });

    console.log('Delivery notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending delivery notification:', error);
    throw new Error('Failed to send delivery notification');
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  console.log('🧪 Testing email configuration...');
  
  try {
    const transporter = createTransporter();
    
    // Test connection
    await transporter.verify();
    console.log('✅ Email server connection successful');
    
    // Send test email if in development
    if (process.env.NODE_ENV === 'development' && process.env.TEST_EMAIL_TO) {
      const testResult = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.TEST_EMAIL_TO,
        subject: '🧪 AeroLink Email Test',
        text: 'This is a test email from AeroLink.',
        html: '<p>This is a <strong>test email</strong> from AeroLink.</p>'
      });
      
      console.log('✅ Test email sent:', testResult.messageId);
    }
    
    return { 
      success: true, 
      message: 'Email configuration is valid',
      service: process.env.EMAIL_SERVICE || 'brevo'
    };
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return { 
      success: false, 
      error: error.message,
      hint: 'Check your BREVO_SMTP_KEY and EMAIL_FROM environment variables'
    };
  }
}

// Clean up old rate limit entries (call this periodically)
export function cleanupRateLimits() {
  const now = new Date();
  const currentHour = `${now.getHours()}-${now.getDate()}`;
  const currentDay = now.getDate().toString();
  
  // Keep only current hour
  for (const key of emailTracker.hourly.keys()) {
    if (key !== currentHour) {
      emailTracker.hourly.delete(key);
    }
  }
  
  // Keep only current day
  for (const key of emailTracker.daily.keys()) {
    if (key !== currentDay) {
      emailTracker.daily.delete(key);
    }
  }
}

// Run cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 60 * 60 * 1000);
}