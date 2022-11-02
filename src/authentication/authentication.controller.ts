import { Body, Controller, Post } from '@nestjs/common';
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

  @Post('auth/signin')
  async login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authenticationService.login(dto);
  }
}
