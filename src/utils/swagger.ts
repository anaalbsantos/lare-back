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
      description: 'Email already in use',
      schema: {
        type: 'object',
        example: {
          message: 'Email already in use',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  },
  findAll: {
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
    body: {
      type: CartItem,
      example: {
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
  removeProductFromCart: {
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
    response: {
      ok: {
        description: 'Cart checked out',
        type: Cart,
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
    body: {
      type: Product,
    },
    response: {
      created: {
        description: 'Product created successfully!',
        type: Product,
      },
    },
  },
  findAll: {
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
