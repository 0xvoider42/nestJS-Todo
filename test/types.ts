import {
  AbstractSqlConnection,
  AbstractSqlDriver,
  EntityManager,
} from '@mikro-orm/postgresql';

export type TestDataBase = EntityManager<
  AbstractSqlDriver<AbstractSqlConnection>
>;
