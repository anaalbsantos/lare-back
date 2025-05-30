import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Product, UpdateProduct } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: Product) {
    const product = await this.prisma.product.create({ data });
    return product;
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product;
  }

  async update(id: string, data: UpdateProduct) {
    const product = await this.prisma.product.update({ where: { id }, data });
    return product;
  }

  async delete(id: string) {
    const product = await this.prisma.product.delete({ where: { id } });
    return product;
  }
}
