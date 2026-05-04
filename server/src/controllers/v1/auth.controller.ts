import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../config/prisma.js";
import { env } from "../../../config/env.js";
import { LoginInput, RegisterInput } from "../../validations/v1/auth.validation.js";

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName, birthdate, mobileNumber, gender } = req.body as RegisterInput;

      const existing = await prisma.credentials.findUnique({ where: { email } });
      if (existing) {
        res.status(409).json({ message: "Email already in use" });
        return;
      }

      const hash = await bcrypt.hash(password, 10);

      const result = await prisma.$transaction(async (tx) => {
        const credentials = await tx.credentials.create({
          data: { email, password: hash },
          select: { accountId: true, email: true },
        });

        const admin = await tx.admin.create({
          data: {
            accountId: credentials.accountId,
            firstName,
            lastName,
            birthdate,
            mobileNumber,
            gender,
          },
          select: {
            adminId: true,
            firstName: true,
            lastName: true,
            birthdate: true,
            mobileNumber: true,
            gender: true,
          },
        });

        return { email: credentials.email, ...admin };
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginInput;

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
