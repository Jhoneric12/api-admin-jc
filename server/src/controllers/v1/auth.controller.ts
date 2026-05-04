import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../config/prisma.js";
import { env } from "../../../config/env.js";

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as { email: string; password: string };

      const existing = await prisma.credentials.findUnique({ where: { email } });
      if (existing) {
        res.status(409).json({ message: "Email already in use" });
        return;
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.credentials.create({
        data: { email, password: hash },
        select: { id: true, email: true },
      });

      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as { email: string; password: string };

      const user = await prisma.credentials.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: "1d" });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
