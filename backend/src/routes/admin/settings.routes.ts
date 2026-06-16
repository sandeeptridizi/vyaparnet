import { Router } from "express";
import { getSettings, updateSettings } from "@/controllers/admin/settings.controller";
import { adminMiddleware } from "@/middleware/admin.middleware";

const router = Router();
router.use(adminMiddleware);

router.get("/", getSettings);
router.put("/", updateSettings);

export default router;
