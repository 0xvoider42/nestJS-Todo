import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as dotenv from 'dotenv';
dotenv.config();

const config: Options = {
  type: 'postgresql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: ['dist/common/entities/*.entitie.js'],
  entitiesTs: ['src/common/entities/*.entitie.ts'],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations',
  },
};

export default config;
