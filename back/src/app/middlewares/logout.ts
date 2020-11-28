import { Request, Response } from 'express';
import { getRedisClient, leaveChannel } from '../../utils';
import { getEnv } from '../../env';
import { decode } from 'jsonwebtoken';

export const logoutMiddleware = async (
  req: Request,
  res: Response
): Promise<void> => {
  const appEnv = getEnv(process.env);
  if (!appEnv) return res.status(500).end();
  const token = req.cookies[appEnv.ACCESS_TOKEN_NAME];
  try {
    const tokenData = decode(token) as Record<string, unknown>;
    const redis = getRedisClient();
    await redis.del(tokenData.ref as string);
    await leaveChannel(tokenData.id as string);
    res.clearCookie(appEnv.ACCESS_TOKEN_NAME);
    req.session.destroy(() => {
      res.status(200).end();
    });
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};
