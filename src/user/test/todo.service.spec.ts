import { Test } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { AppModule } from '../../app.module';
import { AuthenticationService } from '../../authentication/authentication.service';
import config from '../../config/mikro-orm.config';
import { Users } from '../entities/user.entity';

describe('User service', () => {
  let service: AuthenticationService;
  const email = 'ee@ee.com';
  const password = 'qwerty';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = await moduleRef.get(AuthenticationService);
  });

  describe('Create user', () => {
    it('should create new user', async () => {
      const orm = await MikroORM.init(config);
      const em = orm.em as EntityManager;
      const fork = em.fork();

      const getToken = await service.signUp({ email, password });
      const user = await fork.findOne(Users, { email });

      expect(getToken.access_token).toEqual(expect.any(String));
      expect(user).toBeDefined();
      return;
    });
  });
});
