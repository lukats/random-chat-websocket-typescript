import { Channel } from '../models';

export const leaveChannel = async (userId: string): Promise<void> => {
  const channel = await Channel.aggregate([
    {
      $match: { users: { $elemMatch: { $eq: userId } } }
    }
  ]);
  if (channel.length) {
    await Channel.updateOne(
      { name: channel[0].name },
      { users: channel[0].users.filter((user: string) => user !== userId) }
    );
  }
};
