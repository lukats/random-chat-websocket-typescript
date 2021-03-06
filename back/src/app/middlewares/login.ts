import { compare } from 'bcryptjs';
import { getEnv } from '../../env';
import { Request, Response } from 'express';
import { assignChannel } from '../../utils';
import { signTokens } from '../../utils/signTokens';
import { User } from '../../models';

export const loginMiddleware = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    await global.redis.set(tokens.tokenUID, tokens.refreshToken);
    res.cookie(appEnv.ACCESS_TOKEN_NAME, tokens.accessToken, {
      path: '/',
      secure: appEnv.NODE_ENV !== 'development',
      sameSite: 'none',
      httpOnly: true,
      domain:
        appEnv.NODE_ENV === 'development'
          ? appEnv.FRONT_END_URL.replace('http://', '')
          : appEnv.FRONT_END_URL.replace('https://', '')
    });
    const token = await assignChannel(user.id);
    return res.status(200).json({ username: user.username, token }).end();
  } catch (error) {
    await global.airbrake.notify({ error });
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
};
