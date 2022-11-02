import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from 'src/common/Types/Token.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async generateTokens(id: number, email: string): Promise<Tokens> {
    const [token, rf_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        { secret: process.env.SECRET_JWT, expiresIn: 60 * 20 },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        { secret: process.env.RF_SECRET_JWT, expiresIn: 60 * 60 * 24 },
      ),
    ]);

    return {
      access_token: token,
      refresh_token: rf_token,
    };
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

  async login(user: any) {
    const payload = { name: user.name, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
