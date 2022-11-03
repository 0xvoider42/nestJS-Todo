import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import { AuthenticationService } from './authentication.service';
import { RequestValidationPipe } from '../common/pipes/validation.pipe';
import { signInValidation, signUpValidation } from './validation/auth-schema';
import { Token } from '../common/Types/Token.type';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  @UsePipes(new RequestValidationPipe(signUpValidation))
  async signUp(@Body() signUpBody: AuthDto): Promise<Token> {
    return this.authenticationService.signUp(signUpBody);
  }

  @Post('signin')
  @UsePipes(new RequestValidationPipe(signInValidation))
  async logIn(@Body() signInBody: AuthDto): Promise<Token> {
    return this.authenticationService.logIn(signInBody);
  }
}
