import type { NextFunction, Request, Response } from "express";
import jwt, { Algorithm, SignOptions } from "jsonwebtoken";
import { env } from "../../../../config/env.js";
import { prisma } from "../../../../config/prisma.js";
import { APIError } from "../../../utils/app-error.js";
import { comparePassword, hashPassword } from "../../../utils/bcrypt.js";
import { sendSuccess } from "../../../utils/response.js";
import { LoginInput, RegisterInput } from "../../../validations/v1/auth/auth.validation.js";

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName, birthdate, mobileNumber, gender } = req.body as RegisterInput;

      const existing = await prisma.credentials.findUnique({ where: { email } });

      if (existing) {
        throw new APIError("Email already in use.", 409);
      }

      const hash = await hashPassword(password);

      await prisma.$transaction(async (tx) => {
        const credentials = await tx.credentials.create({
          data: { email, password: hash },
          select: { accountId: true, email: true },
        });

        await tx.admin.create({
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
      });

      sendSuccess({ res, data: null, message: "Account created successfully.", statusCode: 201 });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginInput;

      const user = await prisma.credentials.findUnique({ where: { email }, include: { admin: true } });

      if (!user || !(await comparePassword(password, user.password))) {
        throw new APIError("Invalid credentials", 401);
      }

      if (!user.admin) {
        throw new APIError("User profile missing", 400);
      }

      const userResponse = {
        accountId: user?.accountId,
        email: user.email,
        firstName: user.admin?.firstName,
        lastName: user.admin?.lastName,
        birthdate: user.admin?.birthdate,
        mobileNumber: user.admin?.mobileNumber,
        gender: user.admin?.gender,
      };

      const jwtOptions: SignOptions = {
        issuer: env.JWT_ISSUER ?? "",
        audience: env.JWT_AUDIENCE ?? "",
        algorithm: env.JWT_ALGORITHM as Algorithm,
        expiresIn: env.JWT_EXPIRY as SignOptions["expiresIn"],
      };

      const token = jwt.sign({ uid: userResponse?.accountId }, env.JWT_PRIVATE_KEY, jwtOptions);
      sendSuccess({ res, data: { user: userResponse, token }, message: "Login successful" });
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
