import type { Request, Response } from "express";
import db from "@/lib/db";

export const getPromotions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const promotions = await db.promotion.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: promotions });
  } catch (error) {
    console.error("[getPromotions]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createPromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, placement, startDate, endDate, imageUrl } = req.body as {
      title: string; type: string; placement: string;
      startDate: string; endDate: string; imageUrl?: string;
    };
    if (!title || !type || !placement || !startDate || !endDate) {
      res.status(400).json({ success: false, message: "title, type, placement, startDate and endDate are required" });
      return;
    }
    const promotion = await db.promotion.create({
      data: { title, type, placement, startDate: new Date(startDate), endDate: new Date(endDate), imageUrl, status: "Draft" },
    });
    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    console.error("[createPromotion]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updatePromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { title, type, placement, status, startDate, endDate, imageUrl } = req.body as {
      title?: string; type?: string; placement?: string; status?: string;
      startDate?: string; endDate?: string; imageUrl?: string;
    };
    const existing = await db.promotion.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Promotion not found" });
      return;
    }
    const promotion = await db.promotion.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(placement && { placement }),
        ...(status && { status }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });
    res.json({ success: true, data: promotion });
  } catch (error) {
    console.error("[updatePromotion]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deletePromotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const existing = await db.promotion.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Promotion not found" });
      return;
    }
    await db.promotion.delete({ where: { id } });
    res.json({ success: true, message: "Promotion deleted" });
  } catch (error) {
    console.error("[deletePromotion]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
