import { decode } from 'jsonwebtoken';
import { User } from '../models';
import { signTokens, UserTokens } from './signTokens';

export const updateTokens = async (
  token: string
): Promise<UserTokens | null> => {
  const tokenData = decode(token) as Record<string, unknown>;
  let tokens: UserTokens | null = null;
  try {
    let user = null;
    user = await User.findById(tokenData.id);
    if (!user) throw new Error('No user !');
    await global.redis.del(tokenData.ref as string);
    tokens = await signTokens(user.id, user.passwordCount as number);
    await global.redis.set(tokens.tokenUID, tokens.refreshToken);
  } catch (error) {
    await global.airbrake.notify({ error });
    return null;
  }
  return tokens;
};
