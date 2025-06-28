// pages/api/test-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { testEmail } = req.body;
  
  if (!testEmail) {
    return res.status(400).json({ error: 'Test email address required' });
  }

  console.log('🧪 Starting email test...');
  console.log('Environment check:', {
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    BREVO_LOGIN_EMAIL: process.env.BREVO_LOGIN_EMAIL,
    BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY ? '✅ Set' : '❌ Missing',
    EMAIL_FROM: process.env.EMAIL_FROM,
    NODE_ENV: process.env.NODE_ENV
  });

  try {
    // Test both ports
    const configs = [
      { port: 587, name: 'Port 587' },
      { port: 2525, name: 'Port 2525' }
    ];

    for (const config of configs) {
      console.log(`\n🔄 Testing ${config.name}...`);
      
      const transporter = nodemailer.createTransporter({
        host: 'smtp-relay.brevo.com',
        port: config.port,
        secure: false,
        auth: {
          user: process.env.BREVO_LOGIN_EMAIL,
          pass: process.env.BREVO_SMTP_KEY
        },
        debug: true, // Enable debug output
        logger: true // Enable logging
      });

      try {
        // Test connection
        console.log(`Verifying connection on ${config.name}...`);
        await transporter.verify();
        console.log(`✅ ${config.name} connection successful`);

        // Send test email
        console.log(`Sending test email via ${config.name}...`);
        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM || '"AeroLink Test" <noreply@aerolink.app>',
          to: testEmail,
          subject: `🧪 AeroLink Email Test - ${config.name}`,
          text: `This is a test email sent via ${config.name} at ${new Date().toISOString()}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #3b82f6;">🧪 AeroLink Email Test</h2>
              <p>This test email was successfully sent via <strong>${config.name}</strong></p>
              <p><strong>Time:</strong> ${new Date().toISOString()}</p>
              <p><strong>Server:</strong> smtp-relay.brevo.com</p>
              <p><strong>From:</strong> ${process.env.EMAIL_FROM}</p>
              <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; color: #0369a1;">
                  ✅ If you received this email, your SMTP configuration is working correctly!
                </p>
              </div>
            </div>
          `
        });

        console.log(`✅ Email sent successfully via ${config.name}:`, {
          messageId: info.messageId,
          response: info.response
        });

        return res.json({ 
          success: true, 
          message: `Email sent successfully via ${config.name}`,
          messageId: info.messageId,
          port: config.port,
          response: info.response
        });

      } catch (error) {
        console.error(`❌ ${config.name} failed:`, error.message);
        console.error('Full error:', error);
        
        // Continue to next port if this one fails
        if (config === configs[configs.length - 1]) {
          // This was the last config, throw error
          throw error;
        }
      }
    }

  } catch (error) {
    console.error('❌ All email tests failed:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      }
    });
  }
}