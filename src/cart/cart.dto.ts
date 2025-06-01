import { ApiProperty } from '@nestjs/swagger';

export class Cart {
  @ApiProperty({
    description: 'Cart ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Cart status',
    example: 'PENDING',
  })
  status: 'PENDING' | 'PAID';

  @ApiProperty({
    description: 'Cart total',
    example: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Cart creation date',
    example: '2025-06-01T00:00:00.000Z',
  })
  createdAt: Date;
}
