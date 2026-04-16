import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { sellerProfileController } from "./sellerProfile.controller";
import { upload } from "../../middlewares/upload.middleware";
import { USER_ROLE } from "../../types/role";

const router = Router();

//* Create seller profile (become a seller)
router.post("/", requireAuth, upload.single('logo'), sellerProfileController.createSellerProfile);

export const sellerProfileRoutes = router;
