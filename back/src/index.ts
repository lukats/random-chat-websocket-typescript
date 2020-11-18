import 'reflect-metadata';
import { getEnv } from './env';
import { connect, disconnect } from 'mongoose';
import buildApp from './app';
import { createServer as serverHTTP } from 'http';
import { createServer as serverHTTPS } from 'https';

const main = async (): Promise<void> => {
  try {
    const app = await buildApp();
    if (!app) throw new Error('No app, because no environment defined');

    const appEnv = getEnv(process.env);
    if (!appEnv) throw new Error('No environment variable');

    await connect(appEnv.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    const server =
      appEnv.NODE_ENV === 'development' ? serverHTTP(app) : serverHTTPS(app);
    server.listen(appEnv.PORT, () => console.info(`∆ :${appEnv.PORT}`));
    await new Promise((resolve, reject) => {
      server.on('close', resolve);
      server.on('error', reject);
    });
  } catch (err) {
    console.info('∆!!!\n\n', err);
    process.exit(1);
  } finally {
    await disconnect();
  }
};

main();
