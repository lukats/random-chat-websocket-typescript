import { getEnv } from '../../env';
import { Server as ServerHttp } from 'http';
import { Server as ServerHttps } from 'https';
import * as WebSocket from 'ws';
import { Server as ServerWs, MessageEvent } from 'ws';
import { isAuthenticated, isInChannel, verifyClient } from './handlers';
import { parseCookies } from '../../utils';
import * as urlParser from 'url-parse';
import { EventEmitter } from 'events';

export interface OpenEventParams {
  channel: string;
  ws: WebSocket;
}

export interface CloseEventParams {
  channel: string;
  ws: WebSocket;
}

export interface MessageEventParams {
  channel: string;
  ws: WebSocket;
  data: string;
}

export const buildSocket = (
  server: ServerHttp | ServerHttps,
  emitter: EventEmitter['emit']
): ServerWs => {
  const appEnv = getEnv(process.env);
  if (!appEnv) throw new Error('No environment variable');

  const wss = new ServerWs({
    server,
    verifyClient,
    path: '/chat'
  });

  wss.on('connection', async (ws, req) => {
    const cookies = parseCookies(`${req.headers['cookie']}`);
    if (!(await isAuthenticated(cookies))) return;
    if (!(await isInChannel(cookies, req.url))) return;

    const {
      query: { channel }
    } = urlParser(`${req.url}`, true);
    if (!channel) return;

    ws.onopen = () => {
      emitter('open', { channel, ws } as OpenEventParams);
    };

    ws.onmessage = (event: MessageEvent) => {
      emitter('message', {
        channel,
        ws,
        data: event.data
      } as MessageEventParams);
    };
    ws.onclose = () => {
      emitter('close', { channel, ws } as CloseEventParams);
    };
  });

  return wss;
};
