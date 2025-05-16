import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import * as jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    restaurantId: string;
  };
}

export const authGuard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token) as jwt.JwtPayload;
    
    // Validate token payload
    if (!decoded.userId || !decoded.restaurantId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }
    
    // Extract only the properties we need
    req.user = {
      userId: decoded.userId,
      restaurantId: decoded.restaurantId
    };
    
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}; 