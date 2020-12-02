import 'reflect-metadata';
import './globals.js';
import { getEnv } from './env';
import { connect, disconnect } from 'mongoose';
import buildApp from './app';
import { createServer as serverHTTP } from 'http';
import { createServer as serverHTTPS } from 'https';
import { buildSocket } from './app/websocket';
import { Notifier } from '@airbrake/node';

const main = async (): Promise<void> => {
  try {
    global.airbrake = new Notifier({
      projectId: parseInt(`${process.env.PROJECT_ID}`, 10),
      projectKey: `${process.env.PROJECT_KEY}`,
      environment: process.env.NODE_ENV
    });
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

    const io = buildSocket(server);

    server.listen(
      appEnv.PORT,
      () =>
        appEnv.NODE_ENV === 'development' && console.info(`∆ :${appEnv.PORT}`)
    );
    await new Promise((resolve, reject) => {
      server.on('close', (msg: unknown) => {
        io.close();
        resolve(msg);
      });
      server.on('error', (err: unknown) => {
        io.close();
        reject(err);
      });
    });
  } catch (err) {
    await global.airbrake.notify({ error: err });
    process.exit(1);
  } finally {
    await disconnect();
  }
};

main();
