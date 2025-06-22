import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const onboardingGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  if (!user.isEmailVerified) {
    return res.status(403).json({ message: 'Email not verified.' });
  }
  if (!user.isProfileComplete) {
    return res.status(403).json({ message: 'Profile not complete.' });
  }
  next();
}; 