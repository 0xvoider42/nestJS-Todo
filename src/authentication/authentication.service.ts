import { ForbiddenException, Injectable } from '@nestjs/common';
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
    const passwordHash = await this.hashData(signUpBody.password);

    const newUser = await this.usersService.create({
      email: signUpBody.email,
      passwordHash,
    });

    const token = await this.generateToken(newUser.id, newUser.email);

    return token;
  }

  async signIn(logInBody: AuthDto) {
    const user = await this.usersService.findOne(logInBody.email);

    const verify = await bcrypt.compare(logInBody.password, user.passwordHash);

    if (!verify) {
      throw new ForbiddenException('Access denied');
    }

    const token = await this.generateToken(user.id, user.email);

    return { id: user.id, email: user.email, token };
  }
}
