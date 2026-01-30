import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { addressController } from "./address.controller";
import { USER_ROLE } from "../../types/role";

const router = Router();

// All address routes require authentication and customer role
router.use(requireAuth, roleGuard(USER_ROLE.CUSTOMER));

// Address management routes
router.post("/", addressController.createAddress);
router.get("/", addressController.getMyAddresses);
router.get("/:id", addressController.getAddress);
router.put("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);

// Set default address
router.put("/:id/default", addressController.setDefaultAddress);

export const addressRoutes = router;