import { Injectable } from '@nestjs/common';
import { UpdateUser, User } from './user.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: User) {
    const user = await this.prisma.user.create({ data });
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async update(id: string, data: UpdateUser) {
    const user = await this.prisma.user.update({ where: { id }, data });
    return user;
  }

  async delete(id: string) {
    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }
}
