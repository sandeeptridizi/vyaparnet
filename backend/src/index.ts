import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "dotenv";

config({ quiet: true });

import authRoutes from "@/routes/auth.routes";
import businessRoutes from "@/routes/business.routes";
import adminAuthRoutes from "@/routes/admin/auth.routes";
import adminUsersRoutes from "@/routes/admin/users.routes";
import adminPromotionsRoutes from "@/routes/admin/promotions.routes";
import adminSettingsRoutes from "@/routes/admin/settings.routes";
import appPromotionsRoutes from "@/routes/app/promotions.routes";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "VyaparNet API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/promotions", adminPromotionsRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/promotions", appPromotionsRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error]", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
