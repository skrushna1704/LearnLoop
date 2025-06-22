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
    html: `<p>Click the link below to verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  };
  await transporter.sendMail(mailOptions);
}; 