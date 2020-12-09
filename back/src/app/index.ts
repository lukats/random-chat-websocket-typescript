import * as Express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as connectRedis from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { getRedisClient } from '../utils';
import { getEnv } from '../env';
import {
  loginMiddleware,
  logoutMiddleware,
  signupMiddleware
} from './middlewares';

async function buildApp(): Promise<Express.Application | null> {
  const appEnv = getEnv(process.env);
  if (!appEnv) return null;

  const app = Express();

  try {
    global.redis = getRedisClient();
  } catch (error) {
    await global.airbrake.notify({ error });
    return null;
  }

  const RedisStore = connectRedis(session);

  app.use(cors({ credentials: true, origin: appEnv.FRONT_END_URL }));
  app.use(cookieParser());
  app.use(Express.json());
  app.use(Express.urlencoded({ extended: true }));
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.enable('trust proxy');
  app.use(
    session({
      store: new RedisStore({ client: global.redis }),
      secret: appEnv.SESSION_SECRET,
      resave: false,
      name: appEnv.SESSION_NAME,
      proxy: appEnv.NODE_ENV !== 'development',
      saveUninitialized: false,
      cookie: {
        path: '/',
        secure: appEnv.NODE_ENV !== 'development',
        sameSite: 'none',
        maxAge: Date.now() + appEnv.JWT_REFRESH_EXP * 1000,
        domain:
          appEnv.NODE_ENV === 'development'
            ? appEnv.FRONT_END_URL.replace('http://', '')
            : appEnv.FRONT_END_URL.replace('https://', '')
      }
    })
  );

  app.get('/logout', logoutMiddleware);
  app.post('/login', loginMiddleware);
  app.post('/signup', signupMiddleware);

  return app;
}

export default buildApp;
