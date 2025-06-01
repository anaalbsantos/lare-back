import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database/prisma.service';
import { CartService } from 'src/cart/cart.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, CartService],
  exports: [UserService],
})
export class UserModule {}
