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
    { secret: process.env.SECRET_JWT, expiresIn: 60 },
  );

  return token;
};

export const createUser = async (data: any) => {
  connection = await dbConnection();

  const passwordHash = await bcrypt.hash(data.password, 10);

  const response = await connection.nativeInsert(Users, {
    email: data.email,
    passwordHash,
  });

  const token = await generateToken(response, data.email);

  return { id: response, access_token: token };
};
