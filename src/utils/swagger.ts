import { Cart } from 'src/cart/cart.dto';
import { CartItem } from 'src/cart/cartItem.dto';
import { Product, UpdateProduct } from 'src/product/product.dto';
import { UpdateUser, User } from 'src/user/user.dto';

export const ParamId = {
  example: '123e4567-e89b-12d3-a456-426614174000',
  required: true,
};

export const UnauthorizedResponse = {
  description: 'Token was not provided or is invalid or expired',
  schema: {
    example: {
      message: ['Token is required', 'Token is invalid or expired'],
      error: 'Unauthorized',
      statusCode: 401,
    },
  },
};

export const UserSwagger = {
  create: {
    operation: {
      summary: 'Create a new user',
      description: 'Create a new user. This route is public.',
    },
    body: {
      type: User,
    },
    response: {
      created: {
        description: 'User created successfully!',
        type: User,
      },
    },
    badRequest: {
      description: 'Email already in use or password is not strong enough',
      schema: {
        type: 'object',
        example: {
          message: [
            'Email already in use',
            'Invalid email',
            'Password must be a string',
            'Password must be at least 8 characters long',
            'Password must contain at least 1 number and 1 symbol',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  },
  findAll: {
    operation: {
      summary: 'Find all users',
      description: 'Find all users. Only admins can find all users.',
    },
    response: {
      ok: {
        description: 'Users found successfully!',
        type: User,
        isArray: true,
      },
      notFound: {
        description: 'No users found',
      },
    },
  },
  findById: {
    operation: {
      summary: 'Find a user by id',
      description:
        'Find a user by id. You must be logged in to access this route.',
    },
    response: {
      ok: {
        description: 'User found successfully!',
        type: User,
      },
      notFound: {
        description: 'User not found',
      },
    },
  },
  update: {
    operation: {
      summary: 'Update a user',
      description: 'Update a user. You must be logged in to access this route.',
    },
    body: {
      type: UpdateUser,
      examples: {
        ex1: {
          value: {
            email: 'test@email.com',
          },
          summary: 'Update user email',
        },
      },
    },
    response: {
      ok: {
        description: 'User updated successfully!',
        type: User,
      },
      notFound: {
        description: 'User not found',
      },
      badRequest: {
        description: 'Email already in use',
      },
    },
  },
  delete: {
    operation: {
      summary: 'Delete a user',
      description: 'Delete a user. You must be logged in to access this route.',
    },
    response: {
      ok: {
        description: 'User deleted successfully!',
        type: User,
      },
      notFound: {
        description: 'User not found',
      },
    },
  },
};

export const CartSwagger = {
  findCart: {
    operation: {
      summary: 'Find a cart by user id',
      description:
        'Find a cart by user id. You must be logged in to access this route.',
    },
    response: {
      ok: {
        description: 'Cart found successfully!',
        type: Cart,
        schema: {
          type: 'object',
          example: {
            message: 'Cart found successfully!',
            cart: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              userId: '123e4567-e89b-12d3-a456-426614174000',
              status: 'PENDING',
              total: 0,
              createdAt: '2025-06-01T00:00:00.000Z',
            },
          },
        },
      },
      notFound: {
        description: 'Cart or user not found',
        schema: {
          type: 'object',
          example: {
            message: ['User not found', 'Cart not found'],
            error: 'Not Found',
            statusCode: 404,
          },
        },
      },
    },
  },
  addProductToCart: {
    operation: {
      summary: 'Add a product to a cart',
      description:
        'Add a product to a cart. You must be logged in to access this route.',
    },
    body: {
      type: CartItem,
      examples: {
        ex1: {
          value: {
            quantity: 1,
          },
          summary: 'Add product to cart',
        },
      },
    },
    response: {
      ok: {
        description: 'Product added to cart',
        schema: {
          type: 'object',
          example: {
            message: 'Product added to cart',
            cartItem: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              productId: '123e4567-e89b-12d3-a456-426614174000',
              quantity: 1,
              cartId: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
        },
      },
      notFound: {
        description: 'Product or user or cart not found',
        schema: {
          type: 'object',
          example: {
            message: ['User not found', 'Product not found', 'Cart not found'],
          },
        },
      },
    },
  },
  removeProductFromCart: {
    operation: {
      summary: 'Remove a product from a cart',
      description:
        'Remove a product from a cart. You must be logged in to access this route.',
    },
    response: {
      ok: {
        description: 'Product removed from cart',
        type: Cart,
      },
      notFound: {
        description: 'Product or user or cart not found',
        schema: {
          type: 'object',
          example: {
            message: ['User not found', 'Product not found', 'Cart not found'],
          },
        },
      },
    },
  },
  checkout: {
    operation: {
      summary: 'Checkout a cart',
      description:
        'Checkout a cart. You must be logged in to access this route.',
    },
    response: {
      ok: {
        description: 'Cart checked out',
        schema: {
          type: 'object',
          example: {
            message: 'Cart checked out',
          },
        },
      },
      notFound: {
        description: 'Cart not found',
      },
      badRequest: {
        description: 'Cart is not pending',
      },
    },
  },
};

export const ProductSwagger = {
  create: {
    operation: {
      summary: 'Create a new product',
      description: 'Create a new product. Only admins can create products.',
    },
    body: {
      type: Product,
    },
    response: {
      created: {
        description: 'Product created successfully!',
        type: Product,
      },
      badRequest: {
        description: 'Product properties are not valid',
        schema: {
          type: 'object',
          example: {
            message: [
              'Title is required',
              'Title must be a string',
              'Title must be less or equal to 50 characters',
              'Description must be a string',
              'Description must be less or equal to 500 characters',
              'Price is required',
              'Price must be a number',
              'Price must be greater than 0',
              'Stock must be a number',
              'Stock must be greater than 0',
            ],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    },
  },
  findAll: {
    operation: {
      summary: 'Find all products',
      description: 'Find all products. This route is public.',
    },
    response: {
      ok: {
        description: 'Products found successfully!',
        type: Product,
        isArray: true,
      },
      notFound: {
        description: 'No products found',
      },
    },
  },
  findById: {
    operation: {
      summary: 'Find a product by id',
      description: 'Find a product by id. This route is public.',
    },
    response: {
      ok: {
        description: 'Product found successfully!',
        type: Product,
      },
      notFound: {
        description: 'Product not found',
      },
    },
  },
  update: {
    operation: {
      summary: 'Update a product',
      description: 'Update a product. Only admins can update products.',
    },
    body: {
      type: UpdateProduct,
      examples: {
        ex1: {
          value: {
            stock: 100,
          },
          summary: 'Update product stock',
        },

        ex2: {
          value: {
            price: 1000,
            stock: 200,
          },
          summary: 'Update product price and stock',
        },
      },
    },
    response: {
      ok: {
        description: 'Product updated successfully!',
        type: UpdateProduct,
        example: {
          message: 'Product updated successfully!',
          product: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Cama Box de Casal',
            description: 'Cama Box de Casal com 2000 espuma',
            price: 100,
          },
        },
      },
      notFound: {
        description: 'Product not found',
      },
    },
  },
  delete: {
    operation: {
      summary: 'Delete a product',
      description: 'Delete a product. Only admins can delete products.',
    },
    response: {
      ok: {
        description: 'Product deleted successfully!',
        type: Product,
      },
      notFound: {
        description: 'Product not found',
      },
    },
  },
};
