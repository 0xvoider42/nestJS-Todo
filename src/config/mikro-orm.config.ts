import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as dotenv from 'dotenv';
dotenv.config();

const config: Options = {
  type: 'postgresql',
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: ['dist/common/entities/*.entitie.js'],
  entitiesTs: ['src/common/entities/*.entitie.ts'],
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
