import type { Role, OrderStatus } from "../generated/prisma";

export interface CreateOrderPayload {
  customerId: string;
  items: OrderItemPayload[];
  shippingAddress: string;
  paymentMethod?: string | undefined;
  customerNote?: string | undefined;
}

export interface OrderItemPayload {
  medicineId: string;
  quantity: number;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  status: OrderStatus;
  userRole: Role;
  userId: string;
}

export interface GetOrdersParams {
  page?: number | undefined;
  limit?: number | undefined;
  status?: OrderStatus | undefined;
  search?: string | undefined;
}

export interface CheckoutPayload {
  addressId: string;
  paymentMethod?: string | undefined;
  customerNote?: string | undefined;
}