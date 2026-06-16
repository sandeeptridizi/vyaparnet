import { Router } from "express";
import { getAllUsers, getUserById } from "@/controllers/admin/users.controller";
import { adminMiddleware } from "@/middleware/admin.middleware";

const router = Router();

router.use(adminMiddleware);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
