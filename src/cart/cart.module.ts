import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, UserService, ProductService],
})
export class CartModule {}
