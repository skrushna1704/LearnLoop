import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/hash';
import { signJwt } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import { sendResetEmail, sendVerificationEmail } from '../utils/email';

const RESET_PASSWORD_SECRET = process.env.JWT_SECRET + '_reset';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Email, password, first name, and last name are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    const hashedPassword = await hashPassword(password);
    const fullName = `${firstName} ${lastName}`;
    const user = await User.create({
      email,
      password: hashedPassword,
      isEmailVerified: false,
      isProfileComplete: false,
      profile: { name: fullName }
    });

    const verificationToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        name: user.profile?.name
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'This account was created with Google. Please use Google login.' });
    }
    const isMatch = await comparePassword(password, user.password!);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = signJwt({
      id: user._id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      isProfileComplete: user.isProfileComplete,
    });
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        name: user.profile?.name
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      // For security, always respond with success
      return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });
    }
    // Generate reset token (valid for 1 hour)
    const token = jwt.sign({ id: user._id, email: user.email }, RESET_PASSWORD_SECRET, { expiresIn: '1h' });
    // Send email
    await sendResetEmail(user.email, token);
    return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send reset email.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }
    let payload: any;
    try {
      payload = jwt.verify(token, RESET_PASSWORD_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    user.password = await hashPassword(password);
    await user.save();
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password.' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
    
    // Find the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if email matches
    if (user.email !== decoded.email) {
      return res.status(400).json({ message: 'Invalid verification token.' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(200).json({ message: 'Email is already verified.' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully.',
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        name: user.profile?.name
      }
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }
    res.status(500).json({ message: 'Email verification failed.', error });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(200).json({ message: 'Email is already verified.' });
    }

    // Generate new verification token
    const verificationToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      message: 'Verification email sent successfully.',
    });
  } catch (error) {
    console.error('Failed to resend verification email:', error);
    res.status(500).json({ message: 'Failed to resend verification email.' });
  }
};

// The verifyEmail function is completely removed from this file. 