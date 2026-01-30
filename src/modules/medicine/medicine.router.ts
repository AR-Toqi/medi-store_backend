import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { medicineController } from "./medicine.controller";
import { USER_ROLE } from "../../types/role";

const router = Router();

//* Public routes
router.get("/", medicineController.getAllMedicines);
router.get("/:slug", medicineController.getMedicineDetails);

//* Seller routes (authenticated sellers only)
router.post("/", requireAuth, roleGuard(USER_ROLE.SELLER), medicineController.createMedicine);
router.get("/dashboard", requireAuth, roleGuard(USER_ROLE.SELLER), medicineController.getMedicinesBySeller);

router.get("/dashboard/:slug", requireAuth, roleGuard(USER_ROLE.SELLER), medicineController.getMedicineDetailsBySeller);

router.put("/dashboard/:id", requireAuth, roleGuard(USER_ROLE.SELLER), medicineController.updateMedicine);
router.delete("/dashboard/:id", requireAuth, roleGuard(USER_ROLE.SELLER), medicineController.deleteMedicine);

export const medicineRoutes = router;
