import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  dbHost: process.env.DB_HOST ?? 'localhost',
  dbPort: Number(process.env.DB_PORT ?? 5432),
  dbUsername: process.env.DB_USERNAME ?? 'postgres',
  dbPassword: process.env.DB_PASSWORD ?? 'postgres',
  dbDatabase: process.env.DB_DATABASE ?? 'mexinutri_api',
};
