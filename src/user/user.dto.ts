import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class User {
  @ApiProperty({
    description: 'User ID',
    example: 'd3e7cbc5-e835-4eb1-bfd9-91d7cbc5',
    required: false,
    readOnly: true,
  })
  id?: string;

  @ApiProperty({
    description: 'User email',
    example: 'admin@email.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'admin123#',
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]).+$/, {
    message: 'Password must contain at least 1 number and 1 symbol',
  })
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.ADMIN,
    default: Role.CUSTOMER,
    required: false,
  })
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    description: 'User creation date',
    example: '2025-06-01T00:00:00.000Z',
    required: false,
    readOnly: true,
  })
  createdAt?: Date;
}

export class UpdateUser extends PartialType(User) {}
