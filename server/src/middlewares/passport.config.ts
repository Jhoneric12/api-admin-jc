import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";

export const configurePassport = () => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
      const { uid, exp } = jwtPayload;
      try {
        const user = await prisma.admin.findUnique({
          where: { id: uid },
          select: { id: true, email: true },
        });

        if (!user) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }),
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
