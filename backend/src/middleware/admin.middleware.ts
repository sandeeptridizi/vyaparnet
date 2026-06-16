import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string };
    req.adminId = decoded.adminId;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
