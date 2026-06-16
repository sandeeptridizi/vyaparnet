import type { Request, Response } from "express";
import db from "@/lib/db";

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await db.settings.upsert({
      where: { id: "global" },
      create: { id: "global" },
      update: {},
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error("[getSettings]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appName, supportEmail, defaultCurrency, emailNotif, pushNotif, twoFactor, maintenanceMode, autoBackup } = req.body as {
      appName?: string; supportEmail?: string; defaultCurrency?: string;
      emailNotif?: boolean; pushNotif?: boolean; twoFactor?: boolean;
      maintenanceMode?: boolean; autoBackup?: boolean;
    };

    const settings = await db.settings.upsert({
      where: { id: "global" },
      create: {
        id: "global",
        ...(appName && { appName }),
        ...(supportEmail && { supportEmail }),
        ...(defaultCurrency && { defaultCurrency }),
        ...(emailNotif !== undefined && { emailNotif }),
        ...(pushNotif !== undefined && { pushNotif }),
        ...(twoFactor !== undefined && { twoFactor }),
        ...(maintenanceMode !== undefined && { maintenanceMode }),
        ...(autoBackup !== undefined && { autoBackup }),
      },
      update: {
        ...(appName && { appName }),
        ...(supportEmail && { supportEmail }),
        ...(defaultCurrency && { defaultCurrency }),
        ...(emailNotif !== undefined && { emailNotif }),
        ...(pushNotif !== undefined && { pushNotif }),
        ...(twoFactor !== undefined && { twoFactor }),
        ...(maintenanceMode !== undefined && { maintenanceMode }),
        ...(autoBackup !== undefined && { autoBackup }),
      },
    });

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error("[updateSettings]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
