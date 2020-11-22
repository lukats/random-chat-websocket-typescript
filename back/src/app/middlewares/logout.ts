import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../../utils';
import { getEnv } from '../../env';
import { decode } from 'jsonwebtoken';

export const logoutMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const appEnv = getEnv(process.env);
  if (!appEnv) return res.status(500).end();
  const token = req.cookies[appEnv.ACCESS_TOKEN_NAME];
  try {
    const tokenData = decode(token) as Record<string, unknown>;
    const redis = getRedisClient();
    await redis.del(tokenData.ref as string);
    res.clearCookie(appEnv.ACCESS_TOKEN_NAME);
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
  next();
};
