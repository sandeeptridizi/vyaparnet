import { Router } from "express";
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from "@/controllers/admin/promotions.controller";
import { adminMiddleware } from "@/middleware/admin.middleware";

const router = Router();
router.use(adminMiddleware);

router.get("/", getPromotions);
router.post("/", createPromotion);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

export default router;
