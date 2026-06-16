import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import { otpService } from "@/services/otp.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, password } = req.body as { name: string; phone: string; password: string };

    if (!name || !phone || !password) {
      res.status(400).json({ success: false, message: "Name, phone, and password are required" });
      return;
    }

    const existing = await db.user.findUnique({ where: { phone } });
    if (existing) {
      res.status(409).json({ success: false, message: "Phone number already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = otpService.generateOtp();
    const otpExpiry = otpService.getOtpExpiry();

    const user = await db.user.create({
      data: { name, phone, password: hashedPassword, otp, otpExpiry },
      select: { id: true, name: true, phone: true, isVerified: true, createdAt: true },
    });

    await otpService.sendOtp(phone, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your phone.",
      data: user,
    });
  } catch (error) {
    console.error("[register]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp } = req.body as { phone: string; otp: string };

    if (!phone || !otp) {
      res.status(400).json({ success: false, message: "Phone and OTP are required" });
      return;
    }

    const user = await db.user.findUnique({ where: { phone } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ success: false, message: "Phone already verified" });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ success: false, message: "Invalid OTP" });
      return;
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      res.status(400).json({ success: false, message: "OTP has expired. Please resend." });
      return;
    }

    await db.user.update({
      where: { id: user.id },
      data: { isVerified: true, otp: null, otpExpiry: null },
    });

    const token = jwt.sign({ userId: user.id }, process.env.APP_JWT_SECRET!, {
      expiresIn: process.env.APP_JWT_EXPIRES_IN ?? "30d",
    } as jwt.SignOptions);

    res.json({
      success: true,
      message: "Phone verified successfully",
      token,
      data: { id: user.id, name: user.name, phone: user.phone },
    });
  } catch (error) {
    console.error("[verifyOtp]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body as { phone: string };

    if (!phone) {
      res.status(400).json({ success: false, message: "Phone is required" });
      return;
    }

    const user = await db.user.findUnique({ where: { phone } });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ success: false, message: "Phone already verified" });
      return;
    }

    const otp = otpService.generateOtp();
    const otpExpiry = otpService.getOtpExpiry();

    await db.user.update({ where: { id: user.id }, data: { otp, otpExpiry } });
    await otpService.sendOtp(phone, otp);

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("[resendOtp]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body as { phone: string; password: string };

    if (!phone || !password) {
      res.status(400).json({ success: false, message: "Phone and password are required" });
      return;
    }

    const user = await db.user.findUnique({ where: { phone } });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ success: false, message: "Phone number not verified" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_JWT_SECRET!, {
      expiresIn: process.env.APP_JWT_EXPIRES_IN ?? "30d",
    } as jwt.SignOptions);

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: { id: user.id, name: user.name, phone: user.phone },
    });
  } catch (error) {
    console.error("[login]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
