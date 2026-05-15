import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../../../config/prisma";
import { APIError } from "../../../../../utils/app-error.js";
import { sendSuccess } from "../../../../../utils/response.js";
import {
  CreateUnitInput,
  DeleteUnitInput,
  GetUnitsInput,
  UpdateUnitInput,
} from "../../../../../validations/v1/admin/cms/product/unit.validation";

class UnitController {
  getUnits = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, search } = req.query as unknown as GetUnitsInput["query"];

      const where = search
        ? {
            OR: [{ name: { contains: search } }, { abbreviation: { contains: search } }],
          }
        : {};

      const [total, units] = await Promise.all([
        prisma.unit.count({ where }),
        prisma.unit.findMany({
          where,
          select: { unitId: true, name: true, abbreviation: true },
          orderBy: { name: "desc" },
          skip: (page - 1) * limit,
          take: Number(limit),
        }),
      ]);

      sendSuccess({
        res,
        data: {
          items: units,
          pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
        },
        message: "Units retrieved successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  getUnitById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unit = await prisma.unit.findUnique({
        where: { unitId: req.params.id },
        select: { unitId: true, name: true, abbreviation: true },
      });

      if (!unit) {
        throw new APIError("Unit not found.", 404);
      }

      sendSuccess({ res, data: unit, message: "Unit retrieved successfully." });
    } catch (err) {
      next(err);
    }
  };

  createUnit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, abbreviation } = req.body as CreateUnitInput["body"];

      const existing = await prisma.unit.findFirst({ where: { name } });

      if (existing) {
        throw new APIError("Unit with this name already exists.", 409);
      }

      const unit = await prisma.unit.create({
        data: { name, abbreviation },
        select: { unitId: true, name: true, abbreviation: true },
      });

      sendSuccess({ res, data: unit, message: "Unit created successfully.", statusCode: 201 });
    } catch (err) {
      next(err);
    }
  };

  updateUnit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, abbreviation } = req.body as UpdateUnitInput["body"];
      const { unitId } = req.params as UpdateUnitInput["params"];

      const existing = await prisma.unit.findUnique({ where: { unitId } });

      if (!existing) {
        throw new APIError("Unit not found.", 404);
      }

      if (name) {
        const duplicate = await prisma.unit.findFirst({
          where: { name, NOT: { unitId } },
        });

        if (duplicate) {
          throw new APIError("Unit with this name already exists.", 409);
        }
      }

      const unit = await prisma.unit.update({
        where: { unitId },
        data: { name, abbreviation },
        select: { unitId: true, name: true, abbreviation: true },
      });

      sendSuccess({ res, data: unit, message: "Unit updated successfully." });
    } catch (err) {
      next(err);
    }
  };

  deleteUnit = async (req: Request, res: Response, next: NextFunction) => {
    const { unitId } = req.params as DeleteUnitInput["params"];

    try {
      const existing = await prisma.unit.findUnique({ where: { unitId } });

      if (!existing) {
        throw new APIError("Unit not found.", 404);
      }

      await prisma.unit.delete({ where: { unitId } });

      sendSuccess({ res, data: null, message: "Unit deleted successfully." });
    } catch (err) {
      next(err);
    }
  };
}

export const unitController = new UnitController();
