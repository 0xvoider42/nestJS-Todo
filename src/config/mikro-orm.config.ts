import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as dotenv from 'dotenv';
dotenv.config();

const config: Options = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  dbName: 'todo-db',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/common/entities/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
