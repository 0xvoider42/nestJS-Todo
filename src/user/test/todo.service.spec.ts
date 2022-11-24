import { Test } from '@nestjs/testing';
import {
  AbstractSqlConnection,
  AbstractSqlDriver,
  EntityManager,
} from '@mikro-orm/postgresql';
import * as bcrypt from 'bcryptjs';

import { AppModule } from '../../app.module';
import { AuthenticationService } from '../../authentication/authentication.service';
import { dbConnection } from '../../../test/utils/index';
import { Users } from '../entities/user.entity';

describe('User service', () => {
  let service: AuthenticationService;
  let connection: EntityManager<AbstractSqlDriver<AbstractSqlConnection>>;

  const email = 'ee@ee.com';
  const password = 'qwerty';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = await moduleRef.get(AuthenticationService);
    connection = await dbConnection();
  });

  describe('User', () => {
    it('should create new user', async () => {
      const spyService = jest.spyOn(service, 'signUp');
      const spyConnection = jest.spyOn(connection, 'findOne');

      const getToken = await service.signUp({ email, password });
      const user = await connection.findOne(Users, { email });

      expect(spyService).toBeCalledTimes(1);
      expect(spyConnection).toBeCalledTimes(1);

      expect(getToken.access_token).toEqual(expect.any(String));
      expect(user).toBeDefined();
      return;
    });

    it('should check if the user has been created', async () => {
      const spy = jest.spyOn(connection, 'findOne');

      const user = await connection.findOne(Users, { email });

      expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should check if user can sign in', async () => {
      const spy = jest.spyOn(service, 'signIn');

      const signInUser = await service.signIn({ email, password });

      expect(signInUser).toEqual(
        expect.objectContaining({ id: 1, email, token: expect.any(Object) }),
      );

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should give an error if user is missing one of the parameters during sing in', async () => {
      const spy = jest.spyOn(service, 'signIn');
      const signInUser = await service.signIn({ email });

      expect(signInUser).toEqual(
        expect.stringContaining('Password is needed to sign in'),
      );

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
