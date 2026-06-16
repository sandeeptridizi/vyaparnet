import type { Request, Response } from "express";
import db from "@/lib/db";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt((req.query["page"] as string) ?? "1", 10);
    const limit = parseInt((req.query["limit"] as string) ?? "20", 10);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      db.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          phone: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          business: {
            include: {
              category: { select: { id: true, name: true } },
              images: { select: { id: true, url: true } },
            },
          },
        },
      }),
      db.user.count(),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[getAllUsers]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        business: {
          include: {
            category: { select: { id: true, name: true } },
            images: { select: { id: true, url: true } },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("[getUserById]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
