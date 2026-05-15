import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../../../config/prisma";
import { APIError } from "../../../../../utils/app-error";

class ProductController {
  getProducts = async (_req: Request, res: Response) => {
    // TODO: Call service layer when needed.
    const data: unknown[] = [];
    res.status(200).json(data);
  };

  getProductById = async (req: Request, res: Response) => {
    // TODO: Call service layer when needed.
    const data = { id: req.params.id };
    res.status(200).json(data);
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, categoryId, prefix } = req.body;

      const existing = await prisma.category.findFirst({ where: { name } });

      if (existing) {
        throw new APIError("Product with this name already exists", 409);
      }

      const product = await prisma.category.create({
        data: { name, description, categoryId, prefix },
        select: { categoryId: true, name: true, description: true, dateCreated: true, dateUpdated: true },
      });
    } catch (err) {
      next(err);
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    // TODO: Call service layer when needed.
    const data = { id: req.params.id, ...req.body };
    res.status(200).json(data);
  };

  deleteProduct = async (_req: Request, res: Response) => {
    // TODO: Call service layer when needed.
    res.status(204).send();
  };
}

export const productController = new ProductController();
