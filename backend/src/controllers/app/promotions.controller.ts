import type { Request, Response } from "express";
import db from "@/lib/db";

export const getAppPromotions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placement } = req.query as { placement?: string };
    const now = new Date();

    const promotions = await db.promotion.findMany({
      where: {
        status: "Live",
        startDate: { lte: now },
        endDate: { gte: now },
        ...(placement ? { placement } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, type: true, placement: true, imageUrl: true, startDate: true, endDate: true },
    });

    res.json({ success: true, data: promotions });
  } catch (error) {
    console.error("[getAppPromotions]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const trackImpression = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    await db.promotion.update({ where: { id }, data: { impressions: { increment: 1 } } });
    res.json({ success: true });
  } catch {
    res.json({ success: true });
  }
};

export const trackClick = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    await db.promotion.update({ where: { id }, data: { clicks: { increment: 1 } } });
    res.json({ success: true });
  } catch {
    res.json({ success: true });
  }
};
