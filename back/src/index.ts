import 'reflect-metadata';
import { getEnv } from './env';
import { connect, disconnect } from 'mongoose';
import buildApp from './app';
import { createServer as serverHTTP } from 'http';
import { createServer as serverHTTPS } from 'https';
import { buildSocket } from './app/websocket';
import * as WebSocket from 'ws';
import { sendToChannel, SendParams } from './app/websocket/handlers';
import {
  OpenEventParams,
  MessageEventParams,
  CloseEventParams
} from './app/websocket';
import { EventEmitter } from 'events';

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

    const emitter = new EventEmitter();

    const clients: Record<string, WebSocket[]> = {};
    emitter.on('open', ({ channel, ws }: OpenEventParams) => {
      if (clients[channel]) {
        clients[channel] = clients[channel].filter((client) => client !== ws);
        clients[channel].push(ws);
      } else clients[channel] = [ws];
    });
    emitter.on('close', ({ channel, ws }: CloseEventParams) => {
      clients[channel] = clients[channel].filter((client) => client !== ws);
    });
    emitter.on('message', ({ channel, ws, data }: MessageEventParams) => {
      console.log(data);
      sendToChannel({ ws, clients: clients[channel], data } as SendParams);
      clients[channel] = clients[channel].filter(
        (client) => client.readyState === WebSocket.OPEN
      );
    });

    const wss = buildSocket(server, emitter.emit);

    server.listen(appEnv.PORT, () => console.info(`∆ :${appEnv.PORT}`));
    await new Promise((resolve, reject) => {
      server.on('close', (msg: unknown) => {
        wss.clients.forEach((socket) => {
          socket.close();
        });
        wss.clients.clear();
        wss.close();
        resolve(msg);
      });
      server.on('error', (err: unknown) => {
        wss.clients.forEach((socket) => {
          socket.close();
        });
        wss.clients.clear();
        wss.close();
        reject(err);
      });
    });
  } catch (err) {
    console.info('∆!!!\n\n', err);
    process.exit(1);
  } finally {
    await disconnect();
  }
};

main();
