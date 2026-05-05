import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, type StrategyOptionsWithoutRequest } from "passport-jwt";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { sendError } from "../utils/response.js";

export const configurePassport = () => {
  const options: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_PUBLIC_KEY,
  };

  passport.use(
    new JwtStrategy(
      options,
      async (jwtPayload: { uid: string; exp: number }, done: (err: unknown, user: unknown, info?: unknown) => void) => {
        const { uid } = jwtPayload;
        try {
          const user = await prisma.credentials.findUnique({
            where: { accountId: uid },
            include: { admin: true },
          });

          if (!user) return done(null, false);

          const userResponse = {
            accountId: user?.accountId,
            email: user.email,
            firstName: user.admin?.firstName,
            lastName: user.admin?.lastName,
            birthdate: user.admin?.birthdate,
            mobileNumber: user.admin?.mobileNumber,
            gender: user.admin?.gender,
          };

          return done(null, userResponse);
        } catch (err) {
          return done(err, false);
        }
      },
    ),
  );
};

// Protect endpoints
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err: unknown, user: Express.User | false) => {
    if (err) return next(err);
    if (!user) {
      sendError({ res, statusCode: 401, message: "Invalid or expired token." });
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
};
