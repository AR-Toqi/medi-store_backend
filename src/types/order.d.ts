import type { Role, OrderStatus } from "../../generated/prisma/enums";

export interface CreateOrderPayload {
  customerId: string;
  items: OrderItemPayload[];
  shippingAddress: string;
  paymentMethod?: string;
  customerNote?: string;
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
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}