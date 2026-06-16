import type { Request, Response } from "express";
import db from "@/lib/db";

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("[getCategories]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const existing = await db.business.findUnique({ where: { userId } });
    if (existing) {
      res.status(409).json({ success: false, message: "Business profile already exists" });
      return;
    }

    const {
      name,
      categoryId,
      description,
      services,
      serviceableAreas,
      address,
      landmark,
      city,
      pincode,
      images,
    } = req.body as {
      name: string;
      categoryId: string;
      description?: string;
      services?: string[];
      serviceableAreas?: string[];
      address: string;
      landmark?: string;
      city: string;
      pincode: string;
      images?: string[];
    };

    if (!name || !categoryId || !address || !city || !pincode) {
      res
        .status(400)
        .json({ success: false, message: "Name, category, address, city, and pincode are required" });
      return;
    }

    const category = await db.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    const business = await db.business.create({
      data: {
        userId,
        name,
        categoryId,
        description: description ?? null,
        services: services ?? [],
        serviceableAreas: serviceableAreas ?? [],
        address,
        landmark: landmark ?? null,
        city,
        pincode,
        images: images?.length
          ? { create: images.map((url) => ({ url })) }
          : undefined,
      },
      include: { category: { select: { id: true, name: true } }, images: true },
    });

    res.status(201).json({ success: true, message: "Business created successfully", data: business });
  } catch (error) {
    console.error("[createBusiness]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMyBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    const business = await db.business.findUnique({
      where: { userId: req.userId! },
      include: { category: { select: { id: true, name: true } }, images: true },
    });

    if (!business) {
      res.status(404).json({ success: false, message: "Business profile not found" });
      return;
    }

    res.json({ success: true, data: business });
  } catch (error) {
    console.error("[getMyBusiness]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateBusiness = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const existing = await db.business.findUnique({ where: { userId } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Business profile not found" });
      return;
    }

    const {
      name,
      categoryId,
      description,
      services,
      serviceableAreas,
      address,
      landmark,
      city,
      pincode,
      images,
    } = req.body as {
      name?: string;
      categoryId?: string;
      description?: string;
      services?: string[];
      serviceableAreas?: string[];
      address?: string;
      landmark?: string;
      city?: string;
      pincode?: string;
      images?: string[];
    };

    if (categoryId) {
      const category = await db.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }
    }

    const updated = await db.business.update({
      where: { userId },
      data: {
        ...(name && { name }),
        ...(categoryId && { categoryId }),
        ...(description !== undefined && { description }),
        ...(services && { services }),
        ...(serviceableAreas && { serviceableAreas }),
        ...(address && { address }),
        ...(landmark !== undefined && { landmark }),
        ...(city && { city }),
        ...(pincode && { pincode }),
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((url) => ({ url })),
          },
        }),
      },
      include: { category: { select: { id: true, name: true } }, images: true },
    });

    res.json({ success: true, message: "Business updated successfully", data: updated });
  } catch (error) {
    console.error("[updateBusiness]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
