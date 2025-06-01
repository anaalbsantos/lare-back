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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UpdateUser } from './user.dto';
import * as bcryptjs from 'bcryptjs';
import { Public } from 'src/auth/public.decorator';
import { Role } from '@prisma/client';
import { Roles } from 'src/roles/role.decorator';
import { CartService } from 'src/cart/cart.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService,
  ) {}

  @Post()
  @Public()
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

    // Inicializa o carrinho do usuário
    await this.cartService.createCart({
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    return {
      message: 'User created successfully',
      user: user,
    };
  }

  @Get()
  @Roles(Role.ADMIN)
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

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const user = await this.userService.delete(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
