import {
  AbstractSqlConnection,
  AbstractSqlDriver,
  EntityManager,
} from '@mikro-orm/postgresql';
import * as bcrypt from 'bcryptjs';
import {
  NotNullConstraintViolationException,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../app.module';
import { AuthenticationService } from '../../authentication/authentication.service';
import { dbConnection } from '../../../test/utils/index';
import { Users } from '../entities/user.entity';
import { createUser } from '../../../test/queries';

describe('User service', () => {
  let service: AuthenticationService;
  let connection: EntityManager<AbstractSqlDriver<AbstractSqlConnection>>;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = await moduleRef.get(AuthenticationService);
    connection = await dbConnection();
    jwt = new JwtService();
  });

  describe('signUp', () => {
    it('should create new user', async () => {
      const email = 'ee@ee.com';
      const password = 'qwerty';

      // console.log(await createUser({ email, password }));

      const getToken = await createUser({ email, password });
      const user = await connection.findOne(Users, { email });

      expect(getToken.access_token).toEqual(expect.any(String));

      expect(jwt.decode(getToken.access_token)).toEqual(
        expect.objectContaining({ sub: user.id, email }),
      );

      expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);

      expect(user).toBeDefined();
    });

    it('should not allow creating new user if email is already in database', async () => {
      const email = 'ee@ee.com';
      const password = 'qwerty';

      expect(() => createUser({ email, password })).rejects.toThrow(
        new UniqueConstraintViolationException(new Error()).message,
      );
    });

    it('should not allow creating new user if email is missing', async () => {
      const password = 'qwerty';

      expect(() => createUser({ password })).rejects.toThrow(
        new NotNullConstraintViolationException(new Error()).message,
      );
    });

    it('should not allow creating new user if password is missing', async () => {
      const email = 'ee@ee.com';
      expect(() => createUser({ email })).rejects.toThrow(
        new ForbiddenException('Password is not provided'),
      );
    });
  });

  describe('signIn', () => {
    it('should allow user to sign in with correct credentials', async () => {
      const email = 'ee@ee.com';
      const password = 'qwerty';

      const signInUser = await service.signIn({ email, password });

      expect(signInUser).toEqual(
        expect.objectContaining({ id: 1, email, token: expect.any(Object) }),
      );

      expect(jwt.decode(signInUser.token.access_token)).toEqual(
        expect.objectContaining({ sub: 1, email }),
      );
    });

    it('should give an error if user is missing one of the parameters during sing in', async () => {
      const email = 'ee@ee.com';
      const password = 'qwerty';

      expect(() => service.signIn({ email })).rejects.toThrow(
        new ForbiddenException('Check your password or email'),
      );

      expect(() => service.signIn({ password })).rejects.toThrow(
        new ForbiddenException('Check your password or email'),
      );
    });

    it('should give an error if user has incorrect parameters during sing in', async () => {
      const email = 'ee@ee.com';
      const password = 'qwerty';

      expect(() =>
        service.signIn({ email: 'incorrect', password }),
      ).rejects.toThrow(new ForbiddenException('Check your password or email'));

      expect(() =>
        service.signIn({ email, password: 'incorrect' }),
      ).rejects.toThrow(new ForbiddenException('Check your password or email'));
    });
  });
});
