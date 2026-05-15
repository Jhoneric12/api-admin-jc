import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      res.status(422).json({
        message: "Validation failed",
        errors: result.error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }

    req.body = result.data.body;

    // if (result.data.params) {
    //   Object.assign(req.params, result.data.params);
    // }

    // if (result.data.query) {
    //   Object.assign(req.query, result.data.query);
    // }

    next();
  };
