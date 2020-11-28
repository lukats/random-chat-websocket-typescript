import { getEnv } from '../../../env';
import * as urlParser from 'url-parse';
import { Channel, User } from '../../../models';
import { decode } from 'jsonwebtoken';

export const isInChannel = async (
  cookies: Record<string, string | null>,
  url: string | undefined
): Promise<boolean> => {
  if (!url) return false;

  const appEnv = getEnv(process.env);
  if (!appEnv) return false;

  const accessToken = cookies[appEnv.ACCESS_TOKEN_NAME];
  if (!accessToken) return false;
  const { query } = urlParser(url, true);
  if (!query.channel) return false;
  const tokenData = decode(accessToken) as Record<string, unknown>;
  try {
    const user = await User.findOne({ id: tokenData.id });
    if (!user) return false;
    const channel = await Channel.aggregate([
      {
        $match: { users: { $elemMatch: { $eq: user.id } } }
      }
    ]);
    if (!channel.length) return false;
    if (channel[0].name !== query.channel) return false;
  } catch (error) {
    return false;
  }
  return true;
};
