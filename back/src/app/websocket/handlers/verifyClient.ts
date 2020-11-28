import { getEnv } from '../../../env';
import { IncomingMessage } from 'http';
import { parseCookies } from '../../../utils';
import { isAuthenticated } from './isAuthenticated';
import { isInChannel } from './isInChannel';

export const verifyClient = async (info: {
  origin: string;
  req: IncomingMessage;
  secure: boolean;
}): Promise<boolean> => {
  const appEnv = getEnv(process.env);
  if (!appEnv) return false;
  if (info.origin !== appEnv.FRONT_END_URL) return false;
  const cookies = parseCookies(`${info.req.headers['cookie']}`);
  if (!(await isAuthenticated(cookies))) return false;
  if (!(await isInChannel(cookies, info.req.url))) return false;
  return true;
};
