import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { AuthDto } from './dto/auth.dto';
import { Token } from '../common/Types/Token.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async generateToken(id: number, email: string): Promise<Token> {
    const token = await this.jwtService.signAsync(
      {
        sub: id,
        email,
      },
      { secret: process.env.SECRET_JWT, expiresIn: 60 * 60 },
    );

    return { access_token: token };
  }

  async signUp(signUpBody: AuthDto): Promise<Token> {
    const password = await this.hashData(signUpBody.password);

    const newUser = await this.usersService.create({
      email: signUpBody.email,
      password,
    });

    const token = await this.generateToken(newUser.id, newUser.email);

    return token;
  }

  async logIn(logInBody: AuthDto): Promise<Token> {
    const user = await this.usersService.findOne(logInBody.email);

    await bcrypt.compare(logInBody.password, user.password);

    const token = await this.generateToken(user.id, user.email);

    return token;
  }
}
