import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, type StrategyOptionsWithoutRequest } from "passport-jwt";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";

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
          const user = await prisma.admin.findUnique({
            where: { adminId: uid },
            select: { adminId: true },
          });

          if (!user) return done(null, false);

          return done(null, user);
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
      res.status(401).json({ message: "Invalid or expired token." });
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
};
