import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  adminUser?: {
    id: string;
    username: string;
  };
}

export function authAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Access denied. No authorization header provided.' });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: 'Access denied. Authorization format must be: Bearer <token>' });
    return;
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET || 'fallback-portfolio-jwt-secret-string-2026';

  try {
    const decoded = jwt.verify(token, secret) as { id: string; username: string };
    req.adminUser = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired authorization token.' });
  }
}
