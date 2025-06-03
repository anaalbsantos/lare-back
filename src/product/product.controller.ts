import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, UpdateProduct } from './product.dto';
import { Roles } from 'src/roles/role.decorator';
import { Role } from '@prisma/client';
import { Public } from 'src/auth/public.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ParamId,
  ProductSwagger,
  UnauthorizedResponse,
} from 'src/utils/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiBody(ProductSwagger.create.body)
  @ApiOperation(ProductSwagger.create.operation)
  @ApiCreatedResponse(ProductSwagger.create.response.created)
  @ApiBadRequestResponse(ProductSwagger.create.response.badRequest)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async create(@Body() data: Product) {
    const product = await this.productService.create(data);

    return {
      message: 'Product created successfully!',
      product: product,
    };
  }

  @Get()
  @Public()
  @ApiOperation(ProductSwagger.findAll.operation)
  @ApiOkResponse(ProductSwagger.findAll.response.ok)
  @ApiNotFoundResponse(ProductSwagger.findAll.response.notFound)
  async findAll() {
    const products = await this.productService.findAll();

    if (!products) {
      throw new NotFoundException('No products found');
    }

    return {
      message: 'Products found successfully!',
      products: products,
    };
  }

  @Get(':id')
  @Public()
  @ApiParam({ name: 'id', description: 'Product ID', ...ParamId })
  @ApiOperation(ProductSwagger.findById.operation)
  @ApiOkResponse(ProductSwagger.findById.response.ok)
  @ApiNotFoundResponse(ProductSwagger.findById.response.notFound)
  async findById(@Param('id') id: string) {
    const product = await this.productService.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      message: 'Product found successfully!',
      product: product,
    };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID', ...ParamId })
  @ApiBody(ProductSwagger.update.body)
  @ApiOperation(ProductSwagger.update.operation)
  @ApiOkResponse(ProductSwagger.update.response.ok)
  @ApiNotFoundResponse(ProductSwagger.update.response.notFound)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async update(@Param('id') id: string, @Body() data: UpdateProduct) {
    const productExists = await this.productService.findById(id);

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.productService.update(id, data);

    return {
      message: 'Product updated successfully!',
      product: product,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Product ID', ...ParamId })
  @ApiOperation(ProductSwagger.delete.operation)
  @ApiOkResponse(ProductSwagger.delete.response.ok)
  @ApiNotFoundResponse(ProductSwagger.delete.response.notFound)
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  async delete(@Param('id') id: string) {
    const productExists = await this.productService.findById(id);

    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.productService.delete(id);

    return {
      message: 'Product deleted successfully!',
      product: product,
    };
  }
}
