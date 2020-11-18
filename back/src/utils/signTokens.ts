import { sign } from 'jsonwebtoken';
import { getEnv } from '../env';
import { hash } from 'bcryptjs';
import { v1 as uuid } from 'uuid';

export type UserTokens = {
  tokenUID: string;
  accessToken: string;
  refreshToken: string;
};

export const signTokens = async (
  id: string,
  passwordCount: number
): Promise<UserTokens> => {
  const appEnv = getEnv(process.env);
  if (!appEnv) throw new Error('No environment variable');

  const tokenUID = `${appEnv.REFRESH_TOKEN_NAME}-${uuid()}`;
  const accessToken: string = sign(
    {
      id,
      ref: tokenUID,
      exp: Date.now() / 1000 + appEnv.JWT_ACCESS_EXP,
      iat: Date.now() / 1000
    },
    appEnv.JWT_ACCESS_SECRET
  );
  const accessHash = await hash(accessToken, 10);
  const refreshToken: string = sign(
    {
      count: passwordCount,
      hash: accessHash,
      id,
      exp: Date.now() / 1000 + appEnv.JWT_REFRESH_EXP,
      iat: Date.now() / 1000
    },
    appEnv.JWT_REFRESH_SECRET
  );
  return { tokenUID, accessToken, refreshToken };
};
