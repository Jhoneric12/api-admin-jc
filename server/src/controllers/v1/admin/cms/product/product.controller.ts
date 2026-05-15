import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../../../../../config/prisma";
import { APIError } from "../../../../../utils/app-error";
import { sendSuccess } from "../../../../../utils/response";
import { CreateProductInput } from "../../../../../validations/v1/admin/cms/product/product.validation";

const generateSKU = (categoryName: string, productPrefix: string, value: number, unitAbbreviation: string): string => {
  const cat = categoryName.trim().toUpperCase().replace(/\s+/g, "_");
  const prod = productPrefix.trim().toUpperCase();
  const unit = unitAbbreviation.trim().toUpperCase();
  return `${cat}-${prod}-${value}${unit}`;
};

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
      const { name, description, categoryId, prefix, variants } = req.body as CreateProductInput["body"];

      const file = req.file;

      if (!file) {
        throw new APIError("Product image is required", 422);
      }

      const existing = await prisma.category.findFirst({ where: { name } });

      if (existing) {
        throw new APIError("Product with this name already exists", 409);
      }

      const category = await prisma.category.findFirst({ where: { categoryId } });

      if (!category) {
        throw new APIError("Category not found", 404);
      }

      const result = await prisma.$transaction(async (tx) => {
        // Create product
        const product = await tx.product.create({
          data: { name, description, categoryId, prefix },
          select: {
            productId: true,
            imgSrc: req.file?.path,
            categoryId: true,
            name: true,
            description: true,
            prefix: true,
            dateCreated: true,
            dateUpdated: true,
          },
        });

        const createdVariants = [];

        // create variants
        for (const v of variants) {
          const unit = await tx.unit.findFirst({ where: { unitId: v.unitId } });

          if (!unit) {
            throw new APIError(`Unit not found: ${v.unitId}`, 404);
          }

          const sku = generateSKU(category.name.toUpperCase(), prefix, v.value, unit.abbreviation);

          const existingVariant = await tx.productVariant.findFirst({
            where: { sku },
          });

          if (existingVariant) {
            throw new APIError(`Variant with unit "${unit.abbreviation}" and value ${v.value} already exists`, 409);
          }

          const variant = await tx.productVariant.create({
            data: {
              productId: product.productId,
              unitId: v.unitId,
              value: v.value,
              costPrice: v.costPrice,
              sellPrice: v.sellPrice,
              sku,
            },
          });

          createdVariants.push(variant);
        }

        return { product, createdVariants };
      });

      sendSuccess({ res, data: result, message: "Product created successfully.", statusCode: 201 });
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
