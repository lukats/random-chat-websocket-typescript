import * as WebSocket from 'ws';

export interface SendParams {
  ws: WebSocket;
  clients: WebSocket[];
  data: string;
}

export const sendToChannel = ({ ws, clients, data }: SendParams): void => {
  clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};
