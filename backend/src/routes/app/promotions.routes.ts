import { Router } from "express";
import { getAppPromotions, trackImpression, trackClick } from "@/controllers/app/promotions.controller";

const router = Router();

router.get("/", getAppPromotions);
router.post("/:id/impression", trackImpression);
router.post("/:id/click", trackClick);

export default router;
