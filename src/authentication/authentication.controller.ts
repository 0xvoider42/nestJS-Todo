import { Controller, Post, Request } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('auth/login')
  async login(@Request() req) {
    return this.authenticationService.login(req.user);
  }
}
