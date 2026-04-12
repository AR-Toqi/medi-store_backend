import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.router";
import { userRoutes } from "../modules/user/user.router";
import { categoryRoutes } from "../modules/categories/categories.router";
import { sellerProfileRoutes } from "../modules/sellerProfile/sellerProfile.router";
import { medicineRoutes } from "../modules/medicine/medicine.router";
import { orderRoutes } from "../modules/order/order.router";
import { sellerRoutes } from "../modules/seller/seller.router";
import { cartItemRoutes } from "../modules/cartItem/cartItem.router";
import { reviewRoutes } from "../modules/reviews/reviews.router";
import { adminRoutes } from "../modules/admin/admin.router";
import { addressRoutes } from "../modules/address/address.router";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export const indexRoute = router;
