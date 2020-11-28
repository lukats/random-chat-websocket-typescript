import { getEnv } from '../../../env';
import { isUserPresent, isValidTokens } from '../../../utils';

export const isAuthenticated = async (
  cookies: Record<string, string | null>
): Promise<boolean> => {
  const appEnv = getEnv(process.env);
  if (!appEnv) return false;

  const accessToken = cookies[appEnv.ACCESS_TOKEN_NAME];
  if (!accessToken) return false;

  try {
    const [isValidAccessToken, isValidRefreshToken] = await isValidTokens(
      accessToken
    );
    if (!isValidRefreshToken) throw new Error('Need to login');
    if (!isValidAccessToken) throw new Error('No tokens...');

    const isPresent = await isUserPresent(accessToken);
    if (!isPresent) return false;
  } catch (error) {
    return false;
  }
  return true;
};
