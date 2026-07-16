import 'reflect-metadata';
import { createApp } from './app';
import { env } from './config/env';
import { AppDataSource } from './config/database';
import { resetIngredientRepository } from './modules/ingredients/repositories/ingredient.repository';
import { resetDishRepository } from './modules/dishes/repositories/dish.repository';

async function bootstrap(): Promise<void> {
  console.log(`[Database] Attempting connection to ${env.dbHost}:${env.dbPort}/${env.dbDatabase}`);

  try {
    await AppDataSource.initialize();
    console.log('[Database] Connected to PostgreSQL');

    // Reset singletons so they pick up TypeORM repos instead of InMemory
    resetIngredientRepository();
    resetDishRepository();
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