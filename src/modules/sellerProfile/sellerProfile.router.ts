import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { sellerProfileController } from "./sellerProfile.controller";
import { USER_ROLE } from "../../types/role";

const router = Router();

//* Create seller profile (become a seller)
router.post("/", requireAuth, sellerProfileController.createSellerProfile);

//* Get own seller profile
router.get("/", requireAuth, roleGuard(USER_ROLE.SELLER), sellerProfileController.getSellerProfile);

//* Update own seller profile
router.put("/", requireAuth, roleGuard(USER_ROLE.SELLER), sellerProfileController.updateSellerProfile);

//* Delete own seller profile
router.delete("/", requireAuth, roleGuard(USER_ROLE.SELLER), sellerProfileController.deleteSellerProfile);

// Admin routes moved to /api/admin/sellers

export const sellerProfileRoutes = router;
