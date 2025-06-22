import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/hash';
import { signJwt } from '../utils/jwt';

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
    const isMatch = await comparePassword(password, user.password);
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

// The verifyEmail function is completely removed from this file. 