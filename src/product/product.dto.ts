import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class Product {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(50, { message: 'Title must be less or equal to 50 characters' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, {
    message: 'Description must be less or equal to 500 characters',
  })
  description?: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be greater than 0' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than 0' })
  stock?: number;
}

export class UpdateProduct extends PartialType(Product) {}
