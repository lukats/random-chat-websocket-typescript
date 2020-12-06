import { hash } from 'bcryptjs';
import { getEnv } from '../../env';
import { Request, Response } from 'express';
import { signTokens } from '../../utils/signTokens';
import { assignChannel } from '../../utils';
import { User } from '../../models';

export const signupMiddleware = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    await global.redis.set(tokens.tokenUID, tokens.refreshToken);
    res.cookie(appEnv.ACCESS_TOKEN_NAME, tokens.accessToken, {
      path: '/',
      domain:
        appEnv.NODE_ENV === 'development'
          ? appEnv.FRONT_END_URL.replace('http://', '')
          : appEnv.FRONT_END_URL.replace('https://', '')
    });
    const token = await assignChannel(newUser.id);
    return res.status(200).json({ username: newUser.username, token }).end();
  } catch (error) {
    await global.airbrake.notify({ error });
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
};
