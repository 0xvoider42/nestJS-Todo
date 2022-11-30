import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import config from '../../src/config/mikro-orm.config';

export const dbConnection = async () => {
  const orm = await MikroORM.init(config);
  const em = orm.em as EntityManager;
  return em;
};

export const randomStr = () => {
  return (Math.random() + 1).toString(36).substring(10);
};

export const randomEmail = () => {
  return `${randomStr()}@ee.com`;
};
