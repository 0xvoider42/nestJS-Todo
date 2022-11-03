import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from 'src/common/Types/Token.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async generateTokens(id: number, email: string): Promise<Tokens> {
    const token = await this.jwtService.signAsync(
      {
        sub: id,
        email,
      },
      { secret: process.env.SECRET_JWT, expiresIn: 60 * 60 },
    );

    return { access_token: token };
  }

  async signUp(dto: AuthDto): Promise<Tokens> {
    const password = await this.hashData(dto.password);

    const newUser = await this.usersService.create({
      email: dto.email,
      password,
    });

    const tokens = await this.generateTokens(newUser.id, newUser.email);

    return tokens;
  }

  async logIn(dto: AuthDto) {
    const user = await this.usersService.findOne(dto.email);

    await bcrypt.compare(dto.password, user.password);

    const token = await this.generateTokens(user.id, user.email);

    return token;
  }

  async logOut(dto: AuthDto) {
    const user = await this.usersService.findOne(dto.email);

    return this.usersService.update(user);
  }
}
