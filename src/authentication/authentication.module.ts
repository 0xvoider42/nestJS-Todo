import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { TokenStrategy } from './strategies/token.strategy';
import { UsersModule } from '../user/user.module';
import { Users } from '../user/entities/user.entity';

@Module({
  imports: [
    JwtModule.register({}),
    MikroOrmModule.forFeature([Users]),
    UsersModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, TokenStrategy],
})
export class AuthenticationModule {}
