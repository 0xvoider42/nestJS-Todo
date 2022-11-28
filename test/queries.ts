import {
  AbstractSqlConnection,
  AbstractSqlDriver,
  EntityManager,
} from '@mikro-orm/postgresql';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { dbConnection } from './utils';
import { Users } from '../src/user/entities/user.entity';

let connection: EntityManager<AbstractSqlDriver<AbstractSqlConnection>>;
let jwt: JwtService;

const generateToken = async (id: number, email: string) => {
  jwt = new JwtService();

  const token = await jwt.signAsync(
    {
      sub: id,
      email,
    },
    { secret: process.env.SECRET_JWT, expiresIn: 60 * 60 },
  );

  return token;
};

export const createUser = async (data) => {
  connection = await dbConnection();

  const password = await bcrypt.hash(data.password, 10);

  const response = await connection.nativeInsert(Users, {
    email: data.email,
    passwordHash: password,
  });

  const token = await generateToken(response, data.email);

  return { id: response, access_token: token };
};
