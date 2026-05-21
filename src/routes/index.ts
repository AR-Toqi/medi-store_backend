import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.router.js";
import { userRoutes } from "../modules/user/user.router.js";
import { categoryRoutes } from "../modules/categories/categories.router.js";
import { sellerProfileRoutes } from "../modules/sellerProfile/sellerProfile.router.js";
import { medicineRoutes } from "../modules/medicine/medicine.router.js";
import { orderRoutes } from "../modules/order/order.router.js";
import { sellerRoutes } from "../modules/seller/seller.router.js";
import { cartItemRoutes } from "../modules/cartItem/cartItem.router.js";
import { reviewRoutes } from "../modules/reviews/reviews.router.js";
import { adminRoutes } from "../modules/admin/admin.router.js";
import { addressRoutes } from "../modules/address/address.router.js";
import { AIRoutes } from "../modules/ai/ai.router.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/medicines",
    route: medicineRoutes,
  },
  {
    path: "/sellers",
    route: sellerProfileRoutes,
  },
  {
    path: "/seller",
    route: sellerRoutes,
  },
  {
    path: "/orders",
    route: orderRoutes,
  },
  {
    path: "/cart",
    route: cartItemRoutes,
  },
  {
    path: "/reviews",
    route: reviewRoutes,
  },
  {
    path: "/addresses",
    route: addressRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/ai",
    route: AIRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export const indexRoute = router;
