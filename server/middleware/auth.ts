import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        [key: string]: any;
      };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Check if user is authenticated via session
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Attach user info to request
  req.user = {
    id: req.session.userId,
    ...req.session.user
  };

  next();
}

// Middleware to check if user has specific role
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};

// Middleware to check if user is creator
export const requireCreator = requireRole(['creator']);

// Middleware to check if user is admin
export const requireAdmin = requireRole(['admin']);

// Optional authentication - doesn't fail if no user
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session?.userId && req.session?.user) {
    req.user = req.session.user;
  }
  next();
};