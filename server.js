import http from 'http';
import app from './app';
import config from './config';

const server = http.createServer(app.callback());

server.listen(config.port);

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${config.port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${config.port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Listening on ${address.port}`);
});
