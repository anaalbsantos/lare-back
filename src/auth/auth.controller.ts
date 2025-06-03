import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        email: 'admin@email.com',
        password: 'admin123#',
      },
    },
  })
  @ApiOperation({
    summary: 'Sign in',
    description: 'Sign in. This route is public.',
  })
  @ApiCreatedResponse({
    description: 'User signed in successfully!',
    schema: {
      type: 'object',
      example: {
        message: 'User signed in successfully!',
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkM2U3Y2JjNS1lODM1LTRlYjEtYmZkZS05MWQ3Y2JjNSIsImVtYWlsIjoiYWRtaW5AZGVtb2JpbGUuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzE3MjI5MDIyfQ.0000000000000000000000000000000000000000',
        user: {
          id: 'd3e7cbc5-e835-4eb1-bfd9-91d7cbc5',
          email: 'admin@email.com',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid password',
  })
  async signIn(@Body() data: { email: string; password: string }) {
    return this.authService.signIn(data.email, data.password);
  }
}
