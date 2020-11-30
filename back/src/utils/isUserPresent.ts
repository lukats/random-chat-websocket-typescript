import { decode } from 'jsonwebtoken';
import { User } from '../models';

export const isUserPresent = async (token: string): Promise<boolean> => {
  try {
    const tokenData = decode(token) as Record<string, unknown>;
    if (!tokenData) throw new Error('Is null');
    const user = await User.findById(tokenData.id);
    if (!user) throw new Error('No user');
  } catch (error) {
    return false;
  }
  return true;
};
