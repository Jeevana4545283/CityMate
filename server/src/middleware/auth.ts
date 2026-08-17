import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'citymate_super_secret_jwt_key_2026';

export const verifyToken = (token: string): { id: string; email: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { id: string; email: string; role: string };
  } catch (err) {
    return null;
  }
};

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: 'Token invalid or expired' });
    }
    req.user = decoded;
    next();
  } else {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};
