import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import { globalErrorHandler } from './common/error-handler';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use('/api', router);

  app.use(globalErrorHandler);

  return app;
}
