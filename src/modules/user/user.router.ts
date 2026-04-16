import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { userController } from "./user.controller";
import { upload } from "../../middlewares/upload.middleware";
import { USER_ROLE } from "../../types/role";

const router = Router();

//* get current user
router.get("/me", requireAuth, userController.getCurrentUser);

//* update user
router.put("/me", requireAuth, upload.single('image'), userController.updateUser);

export const userRoutes = router;