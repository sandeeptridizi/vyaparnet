import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.APP_JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
