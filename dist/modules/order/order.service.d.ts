import type { CreateOrderPayload, UpdateOrderStatusPayload, GetOrdersParams } from "../../types/order.d";
export declare const orderService: {
    createOrder: (payload: CreateOrderPayload) => Promise<{
        id: string;
        createdAt: Date;
        status: import("../../../generated/prisma").$Enums.OrderStatus;
        totalAmount: number;
        shippingAddress: string;
        paymentMethod: string;
        customerId: string;
    }>;
    createOrderFromCart: (customerId: string, payload: {
        addressId: string;
        paymentMethod?: string;
        customerNote?: string;
    }) => Promise<{
        id: string;
        createdAt: Date;
        status: import("../../../generated/prisma").$Enums.OrderStatus;
        totalAmount: number;
        shippingAddress: string;
        paymentMethod: string;
        customerId: string;
    }>;
    getAllOrders: (params: GetOrdersParams) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: ({
            customer: {
                name: string;
                email: string;
                id: string;
            };
            items: ({
                medicine: {
                    name: string;
                    id: string;
                    price: import("@prisma/client-runtime-utils").Decimal;
                    seller: {
                        id: string;
                        shopName: string;
                    };
                };
            } & {
                id: string;
                price: number;
                medicineId: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            status: import("../../../generated/prisma").$Enums.OrderStatus;
            totalAmount: number;
            shippingAddress: string;
            paymentMethod: string;
            customerId: string;
        })[];
    }>;
    getOrdersBySeller: (sellerId: string, params: GetOrdersParams) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: ({
            customer: {
                name: string;
                email: string;
                id: string;
            };
            items: ({
                medicine: {
                    name: string;
                    id: string;
                    price: import("@prisma/client-runtime-utils").Decimal;
                    seller: {
                        id: string;
                        shopName: string;
                    };
                };
            } & {
                id: string;
                price: number;
                medicineId: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            status: import("../../../generated/prisma").$Enums.OrderStatus;
            totalAmount: number;
            shippingAddress: string;
            paymentMethod: string;
            customerId: string;
        })[];
    }>;
    getOrderDetails: (orderId: string) => Promise<{
        customer: {
            name: string;
            email: string;
            id: string;
        };
        items: ({
            medicine: {
                name: string;
                id: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                imageUrl: string | null;
                seller: {
                    id: string;
                    shopName: string;
                };
            };
        } & {
            id: string;
            price: number;
            medicineId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: import("../../../generated/prisma").$Enums.OrderStatus;
        totalAmount: number;
        shippingAddress: string;
        paymentMethod: string;
        customerId: string;
    }>;
    updateOrderStatus: (payload: UpdateOrderStatusPayload) => Promise<{
        customer: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("../../../generated/prisma").$Enums.OrderStatus;
        totalAmount: number;
        shippingAddress: string;
        paymentMethod: string;
        customerId: string;
    }>;
    getCustomerOrders: (customerId: string, params: GetOrdersParams) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: ({
            items: ({
                medicine: {
                    name: string;
                    id: string;
                    price: import("@prisma/client-runtime-utils").Decimal;
                    imageUrl: string | null;
                };
            } & {
                id: string;
                price: number;
                medicineId: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            status: import("../../../generated/prisma").$Enums.OrderStatus;
            totalAmount: number;
            shippingAddress: string;
            paymentMethod: string;
            customerId: string;
        })[];
    }>;
    cancelOrder: (orderId: string, customerId: string) => Promise<{
        id: string;
        createdAt: Date;
        status: import("../../../generated/prisma").$Enums.OrderStatus;
        totalAmount: number;
        shippingAddress: string;
        paymentMethod: string;
        customerId: string;
    }>;
};
//# sourceMappingURL=order.service.d.ts.map