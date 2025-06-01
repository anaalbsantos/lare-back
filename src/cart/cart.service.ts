import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async createCart(data: Prisma.CartCreateInput) {
    const cart = await this.prisma.cart.create({
      data: {
        user: {
          connect: {
            id: data.user.connect?.id,
          },
        },
      },
    });

    return cart;
  }

  async createCartItem(data: Prisma.CartItemCreateInput) {
    const cartItem = await this.prisma.cartItem.create({
      data: {
        cart: {
          connect: {
            id: data.cart.connect?.id,
          },
        },
        product: {
          connect: {
            id: data.product.connect?.id,
          },
        },
        quantity: data.quantity,
      },
    });

    return cartItem;
  }

  async findById(id: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
    });

    return cart;
  }

  async findProductInCart(cartId: string, productId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });

    return cartItem;
  }

  async findCurrentCartFromUser(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
        status: 'PENDING',
      },
      include: {
        cartItems: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return cart;
  }

  async updateCart(id: string, data: Prisma.CartUpdateInput) {
    const cart = await this.prisma.cart.update({
      where: { id },
      data,
    });

    return cart;
  }

  async updateCartItem(id: string, data: Prisma.CartItemUpdateInput) {
    const cartItem = await this.prisma.cartItem.update({
      where: { id },
      data,
    });

    return cartItem;
  }

  async deleteCartItem(id: string) {
    const cartItem = await this.prisma.cartItem.delete({
      where: { id },
    });

    return cartItem;
  }
}
