import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CartItem {
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity must be greater than 0' })
  quantity: number;
}
