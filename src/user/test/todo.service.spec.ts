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
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';
import {
  NotNullConstraintViolationException,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';

describe('User service', () => {
  let service: AuthenticationService;
  let connection: EntityManager<AbstractSqlDriver<AbstractSqlConnection>>;
  let jwt: JwtService;

  const email = 'ee@ee.com';
  const password = 'qwerty';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = await moduleRef.get(AuthenticationService);
    connection = await dbConnection();
    jwt = new JwtService();
  });

  describe('SignUp', () => {
    it('should create new user', async () => {
      const getToken = await service.signUp({ email, password });
      const user = await connection.findOne(Users, { email });

      expect(getToken.access_token).toEqual(expect.any(String));

      expect(jwt.decode(getToken.access_token)).toEqual(
        expect.objectContaining({ sub: user.id, email }),
      );

      expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);

      expect(user).toBeDefined();
    });

    it('should not allow creating new user if email is already in database', async () => {
      expect(() => service.signUp({ email, password })).rejects.toThrow(
        new UniqueConstraintViolationException(new Error()).message,
      );
    });

    it('should not allow creating new user if email is missing', async () => {
      expect(() => service.signUp({ password })).rejects.toThrow(
        new NotNullConstraintViolationException(new Error()).message,
      );
    });

    it('should not allow creating new user if password is missing', async () => {
      expect(() => service.signUp({ email })).rejects.toThrow(
        new ForbiddenException('Password is missing'),
      );
    });
  });

  describe('SignIn', () => {
    it('should check if user can sign in', async () => {
      const signInUser = await service.signIn({ email, password });

      expect(signInUser).toEqual(
        expect.objectContaining({ id: 1, email, token: expect.any(Object) }),
      );

      expect(jwt.decode(signInUser.token.access_token)).toEqual(
        expect.objectContaining({ sub: 1, email }),
      );
    });

    it('should give an error if user is missing one of the parameters during sing in', async () => {
      expect(() => service.signIn({ email })).rejects.toThrow(
        new ForbiddenException('Check your password or email'),
      );
    });
  });
});
