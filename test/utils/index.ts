import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import config from '../../src/config/mikro-orm.config';

export const dbConnection = async () => {
  const orm = await MikroORM.init(config);
  const em = orm.em as EntityManager;
  return em.fork();
};
