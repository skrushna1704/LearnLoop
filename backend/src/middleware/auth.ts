import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyJwt(token);
  if (!payload) {
    res.status(401).json({ message: 'Invalid or expired token.' });
    return;
  }
  User.findById(payload.id)
    .then(user => {
      if (!user) {
        res.status(401).json({ message: 'User not found.' });
        return;
      }
      req.user = user;
      next();
    })
    .catch(() => {
      res.status(401).json({ message: 'User not found.' });
    });
}; 