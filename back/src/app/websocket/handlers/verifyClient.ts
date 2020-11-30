import { getEnv } from '../../../env';
import { IncomingMessage } from 'http';
import { parseCookies } from '../../../utils';
import { isAuthenticated } from './isAuthenticated';
import { isInChannel } from './isInChannel';

export const verifyClient = async (
  origin: string,
  req: IncomingMessage
): Promise<boolean> => {
  const appEnv = getEnv(process.env);
  if (!appEnv) return false;
  if (origin !== appEnv.FRONT_END_URL) return false;
  const cookies = parseCookies(`${req.headers.cookie}`);
  if (!(await isAuthenticated(cookies))) return false;
  if (!(await isInChannel(cookies, req.url))) return false;
  return true;
};
