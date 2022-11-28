import { EntityRepository } from '@mikro-orm/postgresql';
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { AuthDto } from './dto/auth.dto';
import { Token } from '../common/Types/Token.type';
import { Users } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(Users)
    private usersRepository: EntityRepository<Users>,
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

  async emailCheck(email: string) {
    const emailExists = await this.usersRepository.findOne({
      email,
    });

    if (emailExists) {
      throw new HttpException('Email already exists', 409);
    }
  }

  async signUp(signUpBody: AuthDto): Promise<Token> {
    let passwordHash: string;
    try {
      passwordHash = await this.hashData(signUpBody.password);
    } catch (error) {
      throw new ForbiddenException('Password is missing');
    }

    const newUser = await this.userService.create({
      email: signUpBody.email,
      passwordHash,
    });

    const token = await this.generateToken(newUser.id, newUser.email);

    return token;
  }

  async signIn(signInBody: AuthDto) {
    const user = await this.usersRepository.findOne({
      email: signInBody.email,
    });

    try {
      await bcrypt.compare(signInBody.password, user.passwordHash);
    } catch (error) {
      throw new ForbiddenException('Check your password or email');
    }

    const token = await this.generateToken(user.id, user.email);

    return { id: user.id, email: user.email, token };
  }
}
