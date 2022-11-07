import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import { AuthenticationService } from './authentication.service';
import { RequestValidationPipe } from '../common/pipes/validation.pipe';
import { signUpBody, signInBody } from './validation/auth-schema';
import { Token } from '../common/Types/Token.type';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  @UsePipes(new RequestValidationPipe(signUpBody))
  async signUp(@Body() body: AuthDto): Promise<Token> {
    return this.authenticationService.signUp(body);
  }

  @Post('signin')
  @UsePipes(new RequestValidationPipe(signInBody))
  async signIn(@Body() body: AuthDto) {
    return this.authenticationService.signIn(body);
  }
}
