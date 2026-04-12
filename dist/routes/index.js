"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRoute = void 0;
const express_1 = require("express");
const auth_router_1 = require("../modules/auth/auth.router");
const user_router_1 = require("../modules/user/user.router");
const categories_router_1 = require("../modules/categories/categories.router");
const sellerProfile_router_1 = require("../modules/sellerProfile/sellerProfile.router");
const medicine_router_1 = require("../modules/medicine/medicine.router");
const order_router_1 = require("../modules/order/order.router");
const seller_router_1 = require("../modules/seller/seller.router");
const cartItem_router_1 = require("../modules/cartItem/cartItem.router");
const reviews_router_1 = require("../modules/reviews/reviews.router");
const admin_router_1 = require("../modules/admin/admin.router");
const address_router_1 = require("../modules/address/address.router");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_router_1.authRoutes,
    },
    {
        path: "/",
        route: user_router_1.userRoutes,
    },
    {
        path: "/categories",
        route: categories_router_1.categoryRoutes,
    },
    {
        path: "/medicines",
        route: medicine_router_1.medicineRoutes,
    },
    {
        path: "/sellers",
        route: sellerProfile_router_1.sellerProfileRoutes,
    },
    {
        path: "/seller",
        route: seller_router_1.sellerRoutes,
    },
    {
        path: "/orders",
        route: order_router_1.orderRoutes,
    },
    {
        path: "/cart",
        route: cartItem_router_1.cartItemRoutes,
    },
    {
        path: "/reviews",
        route: reviews_router_1.reviewRoutes,
    },
    {
        path: "/addresses",
        route: address_router_1.addressRoutes,
    },
    {
        path: "/admin",
        route: admin_router_1.adminRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.indexRoute = router;
//# sourceMappingURL=index.js.map