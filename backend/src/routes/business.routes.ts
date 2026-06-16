import { Router } from "express";
import {
  getCategories,
  createBusiness,
  getMyBusiness,
  updateBusiness,
} from "@/controllers/business.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();

router.get("/categories", getCategories);
router.post("/", authMiddleware, createBusiness);
router.get("/me", authMiddleware, getMyBusiness);
router.put("/", authMiddleware, updateBusiness);

export default router;
