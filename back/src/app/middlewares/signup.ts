import { hash } from 'bcryptjs';
import { getEnv } from '../../env';
import { Request, Response, NextFunction } from 'express';
import { signTokens } from '../../utils/signTokens';
import { getRedisClient } from '../../utils';
import { User } from '../../models';
import { sign } from 'jsonwebtoken';
import { v1 as uuid } from 'uuid';

export const signupMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const redis = getRedisClient();
  const appEnv = getEnv(process.env);
  if (!appEnv) return res.status(500).end();

  const { username, password } = req.body;
  const { registrationRetry } = (req.session as unknown) as {
    registrationRetry: number | null | undefined;
  };
  if (registrationRetry && registrationRetry > 5) return res.status(401).end();

  try {
    let newUser = await User.findOne({ username });
    if (newUser) throw new Error(`Something wrong`);
    const clearText = Buffer.from(password, 'base64').toString();
    const passHash = await hash(clearText, 10);
    newUser = await User.create({ username, password: passHash });
    const tokens = await signTokens(
      newUser.id as string,
      newUser.passwordCount as number
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
    res.status(200).json({ username: newUser.username, token }).end();
  } catch (error) {
    if (
      req.session &&
      (registrationRetry !== null || registrationRetry !== undefined)
    ) {
      ((req.session as unknown) as {
        registrationRetry: number;
      }).registrationRetry++;
    } else if (req.session) {
      ((req.session as unknown) as {
        registrationRetry: number;
      }).registrationRetry = 1;
    }
    return res.status(400).end();
  }
  next();
};
