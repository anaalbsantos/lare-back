import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { CartItem } from './cartItem.dto';
import { CartSwagger, UnauthorizedResponse, ParamId } from 'src/utils/swagger';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  @Get(':userId')
  @ApiParam({ name: 'userId', description: 'User ID', ...ParamId })
  @ApiOperation(CartSwagger.findCart.operation)
  @ApiOkResponse(CartSwagger.findCart.response.ok)
  @ApiNotFoundResponse(CartSwagger.findCart.response.notFound)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async findCurrentCartFromUser(@Param('userId') userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cart = await this.cartService.findCurrentCartFromUser(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  @Post(':userId/:productId/add-product')
  @ApiParam({ name: 'userId', description: 'User ID', ...ParamId })
  @ApiParam({ name: 'productId', description: 'Product ID', ...ParamId })
  @ApiBody(CartSwagger.addProductToCart.body)
  @ApiOperation(CartSwagger.addProductToCart.operation)
  @ApiOkResponse(CartSwagger.addProductToCart.response.ok)
  @ApiNotFoundResponse(CartSwagger.addProductToCart.response.notFound)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async addProductToCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() data: CartItem,
  ) {
    // Validations
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cart = await this.cartService.findCurrentCartFromUser(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = await this.productService.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if has stock
    if (product.stock < data.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Update product stock
    await this.productService.update(productId, {
      stock: product.stock - data.quantity,
    });

    // Check if product is already in cart
    const productInCart = await this.cartService.findProductInCart(
      cart.id,
      productId,
    );

    let cartItem: CartItem;

    if (productInCart) {
      // Update cart item quantity
      cartItem = await this.cartService.updateCartItem(productInCart.id, {
        quantity: productInCart.quantity + data.quantity,
      });
    } else {
      // Add product to cart
      cartItem = await this.cartService.createCartItem({
        cart: {
          connect: {
            id: cart.id,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
        quantity: data.quantity,
      });
    }

    // Update cart total price
    const totalPrice = cart.total + product.price * data.quantity;
    await this.cartService.updateCart(cart.id, {
      total: totalPrice,
    });

    return {
      message: 'Product added to cart',
      cartItem,
    };
  }

  @Delete(':userId/:productId')
  @ApiParam({ name: 'userId', description: 'User ID', ...ParamId })
  @ApiParam({ name: 'productId', description: 'Product ID', ...ParamId })
  @ApiOperation(CartSwagger.removeProductFromCart.operation)
  @ApiOkResponse(CartSwagger.removeProductFromCart.response.ok)
  @ApiNotFoundResponse(CartSwagger.removeProductFromCart.response.notFound)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async removeProductFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    // Validations
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cart = await this.cartService.findCurrentCartFromUser(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = await this.productService.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if product is in cart
    const productInCart = await this.cartService.findProductInCart(
      cart.id,
      productId,
    );

    if (!productInCart) {
      throw new NotFoundException('Product not found in cart');
    }

    // Update product stock
    await this.productService.update(productId, {
      stock: product.stock + productInCart.quantity,
    });

    // Delete cart item
    await this.cartService.deleteCartItem(productInCart.id);

    // Update cart total price
    const totalPrice = cart.total - product.price * productInCart.quantity;
    await this.cartService.updateCart(cart.id, {
      total: totalPrice,
    });

    return {
      message: 'Product removed from cart',
    };
  }

  @Post(':id/checkout')
  @ApiParam({ name: 'id', description: 'Cart ID', ...ParamId })
  @ApiOperation(CartSwagger.checkout.operation)
  @ApiOkResponse(CartSwagger.checkout.response.ok)
  @ApiNotFoundResponse(CartSwagger.checkout.response.notFound)
  @ApiBadRequestResponse(CartSwagger.checkout.response.badRequest)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async checkout(@Param('id') id: string) {
    const cart = await this.cartService.findById(id);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Check if cart is pending
    if (cart.status !== 'PENDING') {
      throw new BadRequestException('Cart is not pending');
    }
    // Update cart status to PAID
    await this.cartService.updateCart(id, {
      status: 'PAID',
    });
    // Reset cart (create a new pending cart)
    await this.cartService.createCart({
      user: {
        connect: {
          id: cart.userId,
        },
      },
    });

    return {
      message: 'Cart checked out',
    };
  }
}
