import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenStrategy } from './strategies/token.strategy';
import { RfTokenStrategy } from './strategies/refresh_token.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({})],

  controllers: [AuthenticationController],
  providers: [AuthenticationService, TokenStrategy, RfTokenStrategy],
})
export class AuthenticationModule {}
