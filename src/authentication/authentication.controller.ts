import { Body, Controller, Post, Request } from '@nestjs/common';
import { Tokens } from 'src/common/Types/Token.type';
import { AuthenticationService } from './authentication.service';
import { AuthDto } from './dto/auth.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('auth/signup')
  async signUp(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authenticationService.signUp(dto);
  }

  @Post('auth/login')
  async login(@Request() req) {
    return this.authenticationService.login(req.user);
  }
}
