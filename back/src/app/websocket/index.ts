import { getEnv } from '../../env';
import { IncomingMessage, Server as ServerHttp } from 'http';
import { Server as ServerHttps } from 'https';
import { verifyClient } from './handlers';
import * as urlParser from 'url-parse';
import { Server as SocketServer, Socket } from 'socket.io';
import { leaveChannel, parseCookies } from '../../utils';
import { decode } from 'jsonwebtoken';

export const ioMiddlewareWrapper = (
  middleware: (req: IncomingMessage, next: () => void) => Promise<void> | void
) => (socket: Socket, next: () => void): Promise<void> | void =>
  middleware(socket.request, next);

export const buildSocket = (server: ServerHttp | ServerHttps): SocketServer => {
  const appEnv = getEnv(process.env);
  if (!appEnv) throw new Error('No environment variable');

  const io = new SocketServer(server);

  io.use(
    ioMiddlewareWrapper(async (req, next) => {
      if (!(await verifyClient(req.headers.origin as string, req))) return;
      next();
    })
  );
  io.on('connection', (socket: Socket) => {
    const {
      query: { channel }
    } = urlParser(`${socket.request.url}`, true);

    socket.on(`${channel}`, (data) => {
      socket.broadcast.emit(`${channel}`, data);
    });
    socket.on('disconnect', async () => {
      const cookies = parseCookies(`${socket.request.headers.cookie}`);
      const tokenData = decode(
        `${cookies[appEnv.ACCESS_TOKEN_NAME]}`
      ) as Record<string, unknown>;
      await global.redis.del(tokenData.ref as string);
      await leaveChannel(tokenData.id as string);
    });
  });
  return io;
};
