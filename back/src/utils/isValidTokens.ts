import { compare } from 'bcryptjs';
import { getEnv } from '../env';
import { verify, decode } from 'jsonwebtoken';
import { getRedisClient } from './getRedisClient';

export const isValidTokens = async (
  token: string
): Promise<[boolean, boolean]> => {
  const appEnv = getEnv(process.env);
  if (!appEnv) return [false, false];

  const tokenData = decode(token) as Record<string, unknown>;
  let refreshToken: string | null = null;
  const areValid: [boolean, boolean] = [true, true];
  let redis;
  try {
    redis = getRedisClient();
  } catch (error) {
    await global.airbrake.notify({ error });
    return [false, false];
  }
  try {
    verify(token, appEnv.JWT_ACCESS_SECRET);
    refreshToken = await redis.get(tokenData.ref as string);
    if (!refreshToken) throw new Error('Something wrong BANG');
  } catch (error) {
    await global.airbrake.notify({ error });
    if (error.message === 'Something wrong BANG') return [false, false];
    areValid[0] = false;
  }

  try {
    const refreshTokenData = verify(
      refreshToken as string,
      appEnv.JWT_REFRESH_SECRET
    ) as Record<string, unknown>;

    const isCorrect = await compare(token, refreshTokenData.hash as string);
    if (!isCorrect) throw new Error('Something wrong BANG');
  } catch (error) {
    await global.airbrake.notify({ error });
    await redis.del(tokenData.ref as string);
    if (error.message === 'Something wrong BANG') areValid[0] = false;
    areValid[1] = false;
    return areValid;
  }
  return areValid;
};
