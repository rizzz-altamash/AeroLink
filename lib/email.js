// lib/email.js
import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  
  // For development, you can use Gmail or Mailtrap
  // For production, use services like SendGrid, AWS SES, etc.
  
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

  // Production configuration
  // Option 2: Gmail (requires app password)
  if (process.env.EMAIL_SERVER_HOST === 'smtp.gmail.com') {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD // Use app password, not regular password
      }
    });
  }

  // Option 3: Generic SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT || 587,
    secure: process.env.EMAIL_SERVER_PORT === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  });
};

// Email templates
const emailTemplates = {
  verification: (verificationUrl) => ({
    subject: '🚁 Verify Your DroneDelivery Account',
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
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Welcome to DroneDelivery!</h1>
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
                    ✓ Verify Email Address
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
                  © 2024 DroneDelivery. All rights reserved.
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
Welcome to DroneDelivery!

Please verify your email address to activate your account:

${verificationUrl}

This link expires in 24 hours.

If you didn't create an account, please ignore this email.

© 2024 DroneDelivery. All rights reserved.
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

// Send verification email
export async function sendVerificationEmail(email, token) {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
  const template = emailTemplates.verification(verificationUrl);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"DroneDelivery" <noreply@dronedelivery.com>',
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html
    });

    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email, token) {
  const transporter = createTransporter();
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  const template = emailTemplates.passwordReset(resetUrl);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"DroneDelivery" <noreply@dronedelivery.com>',
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
      from: process.env.EMAIL_FROM || '"DroneDelivery" <noreply@dronedelivery.com>',
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
  const transporter = createTransporter();
  
  try {
    // Verify transporter configuration
    await transporter.verify();
    console.log('Email configuration is valid');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { success: false, error: error.message };
  }
}