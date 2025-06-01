import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({
    description: 'Title of the product',
    example: 'Cama Box de Casal',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(50, { message: 'Title must be less or equal to 50 characters' })
  title: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Cama Box de Casal com 2000 espuma',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, {
    message: 'Description must be less or equal to 500 characters',
  })
  description?: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 100,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be greater than 0' })
  price: number;

  @ApiProperty({
    description: 'Stock of the product',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than 0' })
  stock?: number;
}

export class UpdateProduct extends PartialType(Product) {}
