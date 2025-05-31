import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Public()
  async signIn(@Body() data: { email: string; password: string }) {
    return this.authService.signIn(data.email, data.password);
  }
}
