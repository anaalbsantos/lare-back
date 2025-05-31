import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UpdateUser } from './user.dto';
import * as bcryptjs from 'bcryptjs';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: User) {
    const userExists = await this.userService.findByEmail(data.email);
    if (userExists) {
      throw new HttpException('Este email já está em uso', 400);
    }

    const hashedPassword = await bcryptjs.hash(data.password, 6);

    const userWithHashedPassword = {
      ...data,
      password: hashedPassword,
    };

    const user = await this.userService.create(userWithHashedPassword);

    return {
      message: 'User created successfully',
      user: user,
    };
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    if (!users) {
      throw new NotFoundException('Nenhum usuário encontrado');
    }

    return users;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUser) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (data.email) {
      const userExists = await this.userService.findByEmail(data.email);
      if (userExists) {
        throw new BadRequestException('Este email já está em uso');
      }
    }

    if (data.password) {
      const hashedPassword = await bcryptjs.hash(data.password, 6);
      data.password = hashedPassword;
    }

    const updatedUser = await this.userService.update(id, data);
    return updatedUser;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const user = await this.userService.delete(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
