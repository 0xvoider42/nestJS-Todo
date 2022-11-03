import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { TokenStrategy } from './strategies/token.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, TokenStrategy],
})
export class AuthenticationModule {}
