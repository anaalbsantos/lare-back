import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Product, UpdateProduct } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(data: Product) {
    return this.prisma.product.create({ data });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateProduct) {
    return this.prisma.product.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
