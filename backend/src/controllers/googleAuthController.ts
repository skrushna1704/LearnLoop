import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { signJwt } from '../utils/jwt';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Google token is required.' });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token.' });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not found in Google token.' });
    }

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (user) {
      // User exists, update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture && !user.profile?.profilePicture) {
          user.profile = { ...user.profile, profilePicture: picture };
        }
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        email,
        googleId,
        authProvider: 'google',
        isProfileComplete: false,
        profile: {
          name: name || email.split('@')[0],
          profilePicture: picture,
        },
      });
    }

    // Generate JWT token
    const jwtToken = signJwt({
      id: user._id,
      email: user.email,
      isProfileComplete: user.isProfileComplete,
    });

    res.status(200).json({
      message: 'Google authentication successful.',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        isProfileComplete: user.isProfileComplete,
        name: user.profile?.name,
        profilePicture: user.profile?.profilePicture,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ message: 'Google authentication failed.', error: errorMessage });
  }
};

export const getGoogleAuthUrl = async (req: Request, res: Response) => {
  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';
    const clientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      return res.status(500).json({ message: 'Google Client ID not configured.' });
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid email profile')}&` +
      `access_type=offline&` +
      `prompt=consent`;

    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    res.status(500).json({ message: 'Failed to generate Google auth URL.' });
  }
}; 