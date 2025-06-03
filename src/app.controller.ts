import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get welcome message',
    description: 'Get welcome message. This route is public.',
  })
  @ApiOkResponse({
    description: 'Bem-vindo(a) à Larê!',
    type: String,
  })
  getHello(): string {
    return 'Bem-vindo(a) à Larê!';
  }
}
