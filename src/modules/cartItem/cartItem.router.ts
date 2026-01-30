import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { cartItemController } from "./cartItem.controller";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { USER_ROLE } from "../../types/role";

const router = Router();

//* Cart management routes
router.post("/", requireAuth, roleGuard(USER_ROLE.CUSTOMER), cartItemController.addToCart);
router.get("/", requireAuth, roleGuard(USER_ROLE.CUSTOMER), cartItemController.getCartItems);
router.put("/:medicineId", requireAuth, roleGuard(USER_ROLE.CUSTOMER), cartItemController.updateCartItemQuantity);
router.delete("/:medicineId", requireAuth, roleGuard(USER_ROLE.CUSTOMER), cartItemController.removeFromCart);
router.delete("/", requireAuth, roleGuard(USER_ROLE.CUSTOMER), cartItemController.clearCart);

export const cartItemRoutes = router;