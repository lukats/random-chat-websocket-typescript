import { v1 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { getEnv } from '../env';
import { Channel } from '../models';

export const assignChannel = async (userId: string): Promise<string> => {
  const appEnv = getEnv(process.env);
  if (!appEnv) throw new Error('No environment variable');

  let channel = null;
  channel = await Channel.aggregate([
    {
      $match: { users: { $size: 1 } }
    }
  ]);
  if (!channel.length)
    channel = await Channel.aggregate([
      {
        $match: { users: { $size: 0 } }
      }
    ]);
  let name = uuid();
  if (channel.length) {
    name = channel[0].name;
    await Channel.updateOne(
      { name: channel[0].name },
      { users: [...channel[0].users, userId] }
    );
  } else {
    channel = await Channel.create({ name, users: [userId] });
  }

  let token = sign(
    { iat: Date.now() / 1000, channel: name },
    appEnv.CERTIF_SECRET
  );
  token = Buffer.from(token, 'utf8').toString('base64');
  return token;
};
