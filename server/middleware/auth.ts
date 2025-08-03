import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Verify JWT token
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : null;

    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Access token is required' 
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token or user not found' 
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Token verification failed' 
      });
    }
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : null;

    if (token) {
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without user for optional auth
    next();
  }
};

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
      return;
    }

    next();
  };
};

// Admin only
export const adminOnly = authorize('admin');

// Admin or Editor
export const adminOrEditor = authorize('admin', 'editor');

// Check if user owns resource or is admin/editor
export const checkOwnership = (resourceUserField: string = 'createdBy') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }

    // Admin and editors can access any resource
    if (['admin', 'editor'].includes(req.user.role)) {
      next();
      return;
    }

    // For regular users, check ownership in route handler
    // This middleware just ensures they're authenticated
    next();
  };
};

// Validate user status
export const validateUserStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
    return;
  }

  if (!req.user.isActive) {
    res.status(403).json({ 
      success: false, 
      message: 'Account is disabled' 
    });
    return;
  }

  next();
};

export default {
  authenticateToken,
  optionalAuth,
  authorize,
  adminOnly,
  adminOrEditor,
  checkOwnership,
  validateUserStatus,
};