import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { userController } from "./user.controller";
import { USER_ROLE } from "../../types/role";

const router = Router();

//* get current user
router.get("/auth", requireAuth, userController.getCurrentUser);

//* update user
router.put("/auth/me", requireAuth, userController.updateUser);

//* get all users
router.get("/admin/users", requireAuth, roleGuard(USER_ROLE.ADMIN), userController.getAllUsers);

//* delete user
router.delete("/admin/:id", requireAuth, roleGuard(USER_ROLE.ADMIN), userController.deleteUser);

export const userRoutes = router;