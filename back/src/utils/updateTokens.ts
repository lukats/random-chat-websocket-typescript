import { decode } from 'jsonwebtoken';
import { User } from '../models';
import { getRedisClient } from './getRedisClient';
import { signTokens, UserTokens } from './signTokens';

export const updateTokens = async (
  token: string
): Promise<UserTokens | null> => {
  const tokenData = decode(token) as Record<string, unknown>;
  let tokens: UserTokens | null = null;
  try {
    const redis = getRedisClient();
    let user = null;
    user = await User.findOne({ id: tokenData.id });
    if (!user) throw new Error('No user !');
    await redis.del(tokenData.ref as string);
    tokens = await signTokens(user.id, user.passwordCount as number);
    await redis.set(tokens.tokenUID, tokens.refreshToken);
  } catch (error) {
    return null;
  }
  return tokens;
};
