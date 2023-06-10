import { Server } from 'http';
import app from './app';
import logger from './utils/logger';

const port = Number(process.env.PORT);

const server: Server = app.listen(port, (): void => {
  logger.info(`Aapplication listens on PORT: ${port}`);
});


process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
