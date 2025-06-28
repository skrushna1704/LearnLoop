import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/hash';
import { signJwt } from '../utils/jwt';
import jwt from 'jsonwebtoken';
import { sendResetEmail } from '../utils/email';

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
      isProfileComplete: false,
      profile: { name: fullName }
    });
    res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: user._id,
        email: user.email,
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
      isProfileComplete: user.isProfileComplete,
    });
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
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

// The verifyEmail function is completely removed from this file. 