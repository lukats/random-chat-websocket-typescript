import * as envalid from 'envalid';
import path = require('path');

const runNodeEnv = ['development'] as const;
const knownNodeEnv = [...runNodeEnv] as const;

type RunNodeEnv = typeof runNodeEnv[number];
type KnownNodeEnv = typeof knownNodeEnv[number];

interface BaseEnv {
  NODE_ENV: KnownNodeEnv;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_ACCESS_SECRET: string;
  CERTIF_SECRET: string;
  JWT_REFRESH_SECRET: string;
  SESSION_SECRET: string;
  ACCESS_TOKEN_NAME: string;
  REFRESH_TOKEN_NAME: string;
  SESSION_NAME: string;
  JWT_ACCESS_EXP: number;
  JWT_REFRESH_EXP: number;
}

interface AppEnv extends BaseEnv {
  NODE_ENV: RunNodeEnv;
}

const envalidOptions: envalid.StrictCleanOptions = {
  dotEnvPath: null,
  strict: true,
  transformer: (cleanEnv) => ({
    ...(cleanEnv as Record<string, string | number>)
  })
};

const getAppEnv = (env: NodeJS.ProcessEnv = process.env): AppEnv =>
  envalid.cleanEnv<AppEnv>(
    env,
    {
      NODE_ENV: envalid.str({ choices: runNodeEnv }),
      PORT: envalid.port(),
      DATABASE_URL: envalid.url(),
      REDIS_URL: envalid.url(),
      JWT_ACCESS_SECRET: envalid.str({
        choices: ['access_secret'] as const
      }),
      CERTIF_SECRET: envalid.str({
        choices: ['certif_secret'] as const
      }),
      JWT_REFRESH_SECRET: envalid.str({
        choices: ['refresh_secret'] as const
      }),
      SESSION_SECRET: envalid.str({
        choices: ['session_secret'] as const
      }),
      ACCESS_TOKEN_NAME: envalid.str({
        choices: ['access_token_name'] as const
      }),
      REFRESH_TOKEN_NAME: envalid.str({
        choices: ['refresh_token_name'] as const
      }),
      SESSION_NAME: envalid.str({
        choices: ['session_name'] as const
      }),
      JWT_ACCESS_EXP: envalid.num({ choices: [10, 3600] as const }),
      JWT_REFRESH_EXP: envalid.num({ choices: [30, 86400] as const })
    },
    { ...envalidOptions, dotEnvPath: path.resolve('.env') }
  );

const isAppEnv = (env: AppEnv): env is AppEnv =>
  runNodeEnv.includes(env.NODE_ENV as RunNodeEnv);

const getEnv = (env: NodeJS.ProcessEnv = process.env): AppEnv | null => {
  if (runNodeEnv.includes(env.NODE_ENV as RunNodeEnv)) return getAppEnv(env);
  return null;
};

export { getAppEnv, isAppEnv, getEnv };
export type { AppEnv, KnownNodeEnv, RunNodeEnv };
