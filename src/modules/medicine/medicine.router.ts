import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { medicineController } from "./medicine.controller";
import { USER_ROLE } from "../../types/role";

const router = Router();

//* Public routes
router.get("/", medicineController.getAllMedicines);
router.get("/:slug", medicineController.getMedicineDetails);

export const medicineRoutes = router;
