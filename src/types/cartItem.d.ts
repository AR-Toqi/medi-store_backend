export interface CreateCartItemPayload {
  userId: string;
  medicineId: string;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface CartItemResponse {
  id: string;
  userId: string;
  medicineId: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl?: string;
    category: {
      id: string;
      name: string;
    };
    seller: {
      shopName: string;
      user: {
        name: string;
      };
    };
  };
  isAvailable: boolean;
  itemTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartSummary {
  totalItems: number;
  cartTotal: number;
  hasUnavailableItems: boolean;
}

export interface CartResponse {
  items: CartItemResponse[];
  summary: CartSummary;
}