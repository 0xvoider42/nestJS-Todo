import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  type: 'postgresql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: ['dist/todo/**/*.entity.js', 'dist/user/**/*.entity.js'],
  entitiesTs: ['src/todo/**/*.entity.ts', 'src/user/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations',
  },
};

export default config;
