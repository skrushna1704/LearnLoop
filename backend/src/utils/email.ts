import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject: 'Verify your email for LearnLoop',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin: 0;">LearnLoop</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Skill Exchange Platform</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #111827; margin: 0 0 20px 0;">Verify Your Email Address</h2>
          <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
            Welcome to LearnLoop! To complete your registration and start exchanging skills with other learners, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
               style="background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; 
                      border-radius: 6px; display: inline-block; font-weight: 500;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #4f46e5; font-size: 14px; word-break: break-all; margin: 10px 0;">
            <a href="${verifyUrl}" style="color: #4f46e5;">${verifyUrl}</a>
          </p>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 14px;">
          <p style="margin: 0 0 10px 0;">This link will expire in 24 hours.</p>
          <p style="margin: 0;">If you didn't create an account with LearnLoop, you can safely ignore this email.</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

export const sendResetEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject: 'Reset your password for LearnLoop',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin: 0;">LearnLoop</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0;">Skill Exchange Platform</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #111827; margin: 0 0 20px 0;">Reset Your Password</h2>
          <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
            You requested a password reset for your LearnLoop account. Click the button below to set a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; 
                      border-radius: 6px; display: inline-block; font-weight: 500;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #4f46e5; font-size: 14px; word-break: break-all; margin: 10px 0;">
            <a href="${resetUrl}" style="color: #4f46e5;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 14px;">
          <p style="margin: 0 0 10px 0;">This link will expire in 1 hour.</p>
          <p style="margin: 0;">If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
}; 