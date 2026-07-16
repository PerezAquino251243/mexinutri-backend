import 'reflect-metadata';
import { createApp } from './app';
import { env } from './config/env';
import { AppDataSource } from './config/database';

async function bootstrap(): Promise<void> {
  // Try to connect to PostgreSQL, but don't crash if it fails
  try {
    await AppDataSource.initialize();
    console.log('[Database] Connected to PostgreSQL');
  } catch (err) {
    console.error('[Database] Connection error:', err);
    console.log('[Database] PostgreSQL not available, using in-memory storage');
  }

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
}

bootstrap();