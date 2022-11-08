import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import { AuthenticationService } from './authentication.service';
import { RequestValidationPipe } from '../common/pipes/validation.pipe';
import {
  signInBodyValidation,
  signUpBodyValidation,
} from './validation/auth-schema';
import { Token } from '../common/Types/Token.type';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  @UsePipes(new RequestValidationPipe(signUpBodyValidation))
  async signUp(@Body() signUpBody: AuthDto): Promise<Token> {
    await this.authenticationService.emailCheck(signUpBody.email);

    return this.authenticationService.signUp(signUpBody);
  }

  @Post('signin')
  @UsePipes(new RequestValidationPipe(signInBodyValidation))
  async signIn(@Body() signUpBody: AuthDto) {
    return this.authenticationService.signIn(signUpBody);
  }
}
