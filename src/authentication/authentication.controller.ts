import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { RequestValidationPipe } from 'src/common/pipes/validation.pipe';
import { Tokens } from 'src/common/Types/Token.type';
import { AuthenticationService } from './authentication.service';
import { AuthDto } from './dto/auth.dto';
import { authentication } from './validation/auth-schema';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('auth/signup')
  @UsePipes(new RequestValidationPipe(authentication))
  async signUp(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authenticationService.signUp(dto);
  }

  @Post('auth/signin')
  @UsePipes(new RequestValidationPipe(authentication))
  async logIn(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authenticationService.logIn(dto);
  }

  @Post('auth/signout')
  async logOut(@Body() dto: AuthDto) {
    return this.authenticationService.logOut(dto);
  }
}
