import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { v1 as uuid } from 'uuid';
import { getEnv } from '../../env';
import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../../utils';
import { signTokens } from '../../utils/signTokens';
import { User } from '../../models';

export const loginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const redis = getRedisClient();
  const appEnv = getEnv(process.env);
  if (!appEnv) return res.status(500).end();

  const { username, password } = req.body;
  const { connectionRetry } = (req.session as unknown) as {
    connectionRetry: number | null | undefined;
  };
  if (connectionRetry && connectionRetry > 5) return res.status(401).end();
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error(`Something wrong`);
    const clearText = Buffer.from(password, 'base64').toString();
    const isCorrect = await compare(clearText, user.password);
    if (!isCorrect) throw new Error(`Something wrong`);
    const tokens = await signTokens(
      user.id as string,
      user.passwordCount as number
    );
    await redis.set(tokens.tokenUID, tokens.refreshToken);
    res.cookie(appEnv.ACCESS_TOKEN_NAME, tokens.accessToken);
    // TODO: match to available channel (new or with one user)
    let token = sign(
      { iat: Date.now() / 1000, channel: uuid() },
      appEnv.CERTIF_SECRET
    );
    token = Buffer.from(token, 'utf8').toString('base64');
    // END
    res.status(200).json({ username: user.username, token }).end();
  } catch (error) {
    if (
      req.session &&
      (connectionRetry !== null || connectionRetry !== undefined)
    ) {
      ((req.session as unknown) as {
        connectionRetry: number;
      }).connectionRetry++;
    } else if (req.session) {
      ((req.session as unknown) as {
        connectionRetry: number;
      }).connectionRetry = 1;
    }
    return res.status(401).end();
  }
  next();
};
