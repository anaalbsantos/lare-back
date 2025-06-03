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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UpdateUser } from './user.dto';
import * as bcryptjs from 'bcryptjs';
import { Public } from 'src/auth/public.decorator';
import { Role } from '@prisma/client';
import { Roles } from 'src/roles/role.decorator';
import { CartService } from 'src/cart/cart.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ParamId, UnauthorizedResponse, UserSwagger } from 'src/utils/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService,
  ) {}

  @Post()
  @Public()
  @ApiBody(UserSwagger.create.body)
  @ApiOperation(UserSwagger.create.operation)
  @ApiCreatedResponse(UserSwagger.create.response.created)
  @ApiBadRequestResponse(UserSwagger.create.badRequest)
  async create(@Body() data: User) {
    const userExists = await this.userService.findByEmail(data.email);
    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcryptjs.hash(data.password, 6);

    const userWithHashedPassword = {
      ...data,
      password: hashedPassword,
    };

    const user = await this.userService.create(userWithHashedPassword);

    // Create cart for user
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
  @ApiBearerAuth()
  @ApiOperation(UserSwagger.findAll.operation)
  @ApiOkResponse(UserSwagger.findAll.response.ok)
  @ApiNotFoundResponse(UserSwagger.findAll.response.notFound)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async findAll() {
    const users = await this.userService.findAll();

    if (!users) {
      throw new NotFoundException('No users found');
    }

    return {
      message: 'Users found successfully!',
      users,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User ID', ...ParamId })
  @ApiOperation(UserSwagger.findById.operation)
  @ApiOkResponse(UserSwagger.findById.response.ok)
  @ApiNotFoundResponse(UserSwagger.findById.response.notFound)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User found successfully!',
      user,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User ID', ...ParamId })
  @ApiBody(UserSwagger.update.body)
  @ApiOperation(UserSwagger.update.operation)
  @ApiOkResponse(UserSwagger.update.response.ok)
  @ApiNotFoundResponse(UserSwagger.update.response.notFound)
  @ApiBadRequestResponse(UserSwagger.update.response.badRequest)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async update(@Param('id') id: string, @Body() data: UpdateUser) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email) {
      const userExists = await this.userService.findByEmail(data.email);
      if (userExists) {
        throw new BadRequestException('Email already in use');
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
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User ID', ...ParamId })
  @ApiOperation(UserSwagger.delete.operation)
  @ApiOkResponse(UserSwagger.delete.response.ok)
  @ApiNotFoundResponse(UserSwagger.delete.response.notFound)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async delete(@Param('id') id: string) {
    const user = await this.userService.delete(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deleted successfully!',
      user,
    };
  }
}
