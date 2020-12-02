import { getEnv } from '../../env';
import { Request, Response, NextFunction } from 'express';
import { isUserPresent, isValidTokens, updateTokens } from '../../utils';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const appEnv = getEnv(process.env);
  if (!appEnv) return res.status(500).end();

  const accessToken = req.cookies[appEnv.ACCESS_TOKEN_NAME];
  const { connectionRetry } = (req.session as unknown) as {
    connectionRetry: number;
  };
  if (connectionRetry) {
    if (connectionRetry > 5) return res.status(401).end();
  }
  try {
    const [isValidAccessToken, isValidRefreshToken] = await isValidTokens(
      accessToken
    );
    if (!isValidRefreshToken) throw new Error('Need to login');
    if (!isValidAccessToken) {
      const tokens = await updateTokens(accessToken);
      if (!tokens) throw new Error('No tokens...');
      req.cookies[appEnv.ACCESS_TOKEN_NAME] = tokens.accessToken;
      res.cookie(appEnv.ACCESS_TOKEN_NAME, tokens.accessToken);
    }
    const isPresent = await isUserPresent(accessToken);
    if (!isPresent) return res.status(401).end();
  } catch (error) {
    await global.airbrake.notify({ error });
    return res.status(401).end();
  }
  next();
};
