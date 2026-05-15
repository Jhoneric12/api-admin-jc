import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../../../config/prisma";
import { APIError } from "../../../../../utils/app-error.js";
import { sendSuccess } from "../../../../../utils/response.js";
import {
  CreateCategoryInput,
  DeleteCategoryInput,
  GetCategoriesInput,
  UpdateCategoryInput,
} from "../../../../../validations/v1/admin/cms/product/category.validation";

class CategoryController {
  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, search } = req.query as unknown as GetCategoriesInput["query"];

      const where = search ? { name: { contains: search } } : {};

      const [total, categories] = await Promise.all([
        prisma.category.count({ where }),
        prisma.category.findMany({
          where,
          select: { categoryId: true, name: true, dateCreated: true, dateUpdated: true },
          orderBy: { dateCreated: "desc" },
          skip: (page - 1) * limit,
          take: Number(limit),
        }),
      ]);

      sendSuccess({
        res,
        data: {
          items: categories,
          pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
        },
        message: "Categories retrieved successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await prisma.category.findUnique({
        where: { categoryId: req.params.id },
        select: { categoryId: true, name: true, dateCreated: true, dateUpdated: true },
      });

      if (!category) {
        throw new APIError("Category not found.", 404);
      }

      sendSuccess({ res, data: category, message: "Category retrieved successfully." });
    } catch (err) {
      next(err);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as CreateCategoryInput["body"];

      const existing = await prisma.category.findFirst({ where: { name } });

      if (existing) {
        throw new APIError("Category with this name already exists.", 409);
      }

      const category = await prisma.category.create({
        data: { name },
        select: { categoryId: true, name: true, dateCreated: true, dateUpdated: true },
      });

      sendSuccess({ res, data: category, message: "Category created successfully.", statusCode: 201 });
    } catch (err) {
      next(err);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as UpdateCategoryInput["body"];
      const { categoryId } = req.params as UpdateCategoryInput["params"];

      const existing = await prisma.category.findUnique({ where: { categoryId } });

      if (!existing) {
        throw new APIError("Category not found.", 404);
      }

      const duplicate = await prisma.category.findFirst({
        where: { name, NOT: { categoryId } },
      });

      if (duplicate) {
        throw new APIError("Category with this name already exists.", 409);
      }

      const category = await prisma.category.update({
        where: { categoryId },
        data: { name },
        select: { categoryId: true, name: true, dateCreated: true, dateUpdated: true },
      });

      sendSuccess({ res, data: category, message: "Category updated successfully." });
    } catch (err) {
      next(err);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params as DeleteCategoryInput["params"];

    try {
      const existing = await prisma.category.findUnique({ where: { categoryId } });

      if (!existing) {
        throw new APIError("Category not found.", 404);
      }

      await prisma.category.delete({ where: { categoryId } });

      sendSuccess({ res, data: null, message: "Category deleted successfully." });
    } catch (err) {
      next(err);
    }
  };
}

export const categoryController = new CategoryController();
