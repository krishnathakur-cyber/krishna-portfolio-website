import { Request, Response, NextFunction } from 'express';

interface LimitRecord {
  count: number;
  resetTime: number;
}

const ipCache = new Map<string, LimitRecord>();

export function createRateLimiter(windowMs: number, maxRequests: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Collect IP securely from forwarder headers or socket connection
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const key = `${req.path}:${ip}`;
    const now = Date.now();

    const record = ipCache.get(key);

    if (!record) {
      ipCache.set(key, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (now > record.resetTime) {
      // Limit expired, reset count
      ipCache.set(key, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (record.count >= maxRequests) {
      const secondsLeft = Math.ceil((record.resetTime - now) / 1000);
      res.status(429).json({
        error: `Too many transaction requests. Please try again after ${secondsLeft} seconds.`
      });
      return;
    }

    record.count += 1;
    next();
  };
}
