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

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() data: Product) {
    const product = await this.productService.create(data);

    return {
      message: 'Produto criado com sucesso',
      product: product,
    };
  }

  @Get()
  @Public()
  async findAll() {
    const products = await this.productService.findAll();

    if (!products) {
      throw new NotFoundException('Nenhum produto encontrado');
    }

    return products;
  }

  @Get(':id')
  @Public()
  async findById(@Param('id') id: string) {
    const product = await this.productService.findById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() data: UpdateProduct) {
    const productExists = await this.productService.findById(id);

    if (!productExists) {
      throw new NotFoundException('Produto não encontrado');
    }

    const product = await this.productService.update(id, data);

    return {
      message: 'Produto atualizado com sucesso',
      product: product,
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    const productExists = await this.productService.findById(id);

    if (!productExists) {
      throw new NotFoundException('Produto não encontrado');
    }

    const product = await this.productService.delete(id);

    return {
      message: 'Produto deletado com sucesso',
      product: product,
    };
  }
}
