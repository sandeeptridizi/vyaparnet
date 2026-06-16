import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    const admin = await db.admin.findUnique({ where: { email } });
    if (!admin) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
    } as jwt.SignOptions);

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error("[adminLogin]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = await db.admin.findUnique({
      where: { id: req.adminId! },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!admin) {
      res.status(404).json({ success: false, message: "Admin not found" });
      return;
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    console.error("[adminMe]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
