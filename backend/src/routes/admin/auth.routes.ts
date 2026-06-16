import { Router } from "express";
import { adminLogin, adminMe } from "@/controllers/admin/auth.controller";
import { adminMiddleware } from "@/middleware/admin.middleware";

const router = Router();

router.post("/login", adminLogin);
router.get("/me", adminMiddleware, adminMe);

export default router;
