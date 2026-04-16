import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { USER_ROLE } from "../../types/role";
import { sellerController } from "./seller.controller";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

// Apply seller authentication and role guard to all routes
router.use(requireAuth, roleGuard(USER_ROLE.SELLER));

// Dashboard & Analytics
router.get("/stats", sellerController.getDashboardStats);

// Medicine Management
router.get("/medicines", sellerController.getMyMedicines);
router.post("/medicines", upload.single('image'), sellerController.createMedicine);
router.get("/medicines/:slug", sellerController.getMedicineDetails);
router.patch("/medicines/:id", upload.single('image'), sellerController.updateMedicine);
router.delete("/medicines/:id", sellerController.deleteMedicine);

// Order Management
router.get("/orders", sellerController.getMyOrders);
router.patch("/orders/:id", sellerController.updateOrderStatus);

// Profile Management
router.get("/profile", sellerController.getProfile);
router.patch("/profile", upload.single('logo'), sellerController.updateProfile);
router.delete("/profile", sellerController.deleteProfile);

export const sellerRoutes = router;
