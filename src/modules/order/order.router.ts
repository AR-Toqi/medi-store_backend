import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { orderController } from "./order.controller";
import { USER_ROLE } from "../../types/role";

const router = Router();

//* Customer routes (authenticated users)
router.post("/", requireAuth, orderController.createOrder);
router.get("/my-orders", requireAuth, orderController.getMyOrders);
router.post("/checkout", requireAuth, orderController.checkout);

//* Shared routes (customer and admin reach this)
router.get("/:id", requireAuth, orderController.getOrderDetails);
router.put("/:id/status", requireAuth, roleGuard(USER_ROLE.ADMIN), orderController.updateOrderStatus);

export const orderRoutes = router;