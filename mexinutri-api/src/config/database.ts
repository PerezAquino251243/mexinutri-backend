import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { IngredientEntity } from '../modules/ingredients/entities/typeorm/ingredient.typeorm.entity';
import { DishEntity } from '../modules/dishes/entities/typeorm/dish.typeorm.entity';
import { DishIngredientEntity } from '../modules/dishes/entities/typeorm/dish-ingredient.typeorm.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUsername,
  password: env.dbPassword,
  database: env.dbDatabase,
  synchronize: false,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [IngredientEntity, DishEntity, DishIngredientEntity],
});

export async function initializeDatabase(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('[Database] Connected to PostgreSQL');
  }
  return AppDataSource;
}