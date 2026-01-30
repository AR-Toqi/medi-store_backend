import { prisma } from "../../lib/prisma";
import type { CreateCartItemPayload } from "../../types/cartItem.d";

/**
 * Add item to cart or update quantity if already exists
 */
export const addToCart = async (payload: CreateCartItemPayload) => {
  const { userId, medicineId, quantity = 1 } = payload;

  // Validate user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Validate medicine exists and has stock
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    include: {
      category: true,
      seller: {
        select: {
          shopName: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  if (medicine.stock < quantity) {
    throw new Error(`Insufficient stock. Available: ${medicine.stock}, Requested: ${quantity}`);
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  // Check if item already exists in cart
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
  });

  if (existingCartItem) {
    // Update quantity
    const newQuantity = existingCartItem.quantity + quantity;

    if (medicine.stock < newQuantity) {
      throw new Error(`Insufficient stock. Available: ${medicine.stock}, Total in cart would be: ${newQuantity}`);
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: {
        userId_medicineId: {
          userId,
          medicineId,
        },
      },
      data: {
        quantity: newQuantity,
      },
      include: {
        medicine: {
          include: {
            category: true,
            seller: {
              select: {
                shopName: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return updatedCartItem;
  } else {
    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        medicineId,
        quantity,
      },
      include: {
        medicine: {
          include: {
            category: true,
            seller: {
              select: {
                shopName: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return cartItem;
  }
};

/**
 * Get all cart items for a user
 */
export const getCartItems = async (userId: string) => {
  // Validate user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      medicine: {
        include: {
          category: true,
          seller: {
            select: {
              shopName: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate totals and check stock availability
  const cartWithTotals = cartItems.map(item => {
    const isAvailable = item.medicine.stock >= item.quantity;
    const itemTotal = Number(item.medicine.price) * item.quantity;

    return {
      ...item,
      isAvailable,
      itemTotal,
      medicine: {
        ...item.medicine,
        price: Number(item.medicine.price),
      },
    };
  });

  const cartTotal = cartWithTotals.reduce((total, item) => total + item.itemTotal, 0);
  const totalItems = cartWithTotals.reduce((total, item) => total + item.quantity, 0);
  const hasUnavailableItems = cartWithTotals.some(item => !item.isAvailable);

  return {
    items: cartWithTotals,
    summary: {
      totalItems,
      cartTotal,
      hasUnavailableItems,
    },
  };
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (userId: string, medicineId: string, quantity: number) => {
  // Validate user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  // Check if cart item exists and belongs to user
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
    include: {
      medicine: true,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Validate stock availability
  if (cartItem.medicine.stock < quantity) {
    throw new Error(`Insufficient stock. Available: ${cartItem.medicine.stock}, Requested: ${quantity}`);
  }

  // Update quantity
  const updatedCartItem = await prisma.cartItem.update({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
    data: {
      quantity,
    },
    include: {
      medicine: {
        include: {
          category: true,
          seller: {
            select: {
              shopName: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return updatedCartItem;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (userId: string, medicineId: string) => {
  // Validate user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if cart item exists and belongs to user
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Delete cart item
  await prisma.cartItem.delete({
    where: {
      userId_medicineId: {
        userId,
        medicineId,
      },
    },
  });

  return { message: "Item removed from cart successfully" };
};

/**
 * Clear entire cart
 */
export const clearCart = async (userId: string) => {
  // Validate user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Delete all cart items for user
  await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return { message: "Cart cleared successfully" };
};

export const cartItemService = {
  addToCart,
  getCartItems,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};