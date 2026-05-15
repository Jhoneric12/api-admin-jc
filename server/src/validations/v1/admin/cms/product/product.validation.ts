import { z } from "zod";

const variantSchema = z.object({
  unitId: z.uuid({ message: "Unit ID must be a valid UUID" }),
  value: z.coerce.number().positive("Value must be a positive number"),
  costPrice: z.coerce.number().positive("Cost price must be a positive number"),
  sellPrice: z.coerce.number().positive("Sell price must be a positive number"),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(150, "Name must be at most 150 characters"),

    description: z.string().max(500, "Description must be at most 500 characters").optional(),

    categoryId: z.uuid({ message: "Unit ID must be a valid UUID" }),

    prefix: z
      .string()
      .min(1, "Prefix is required")
      .max(20, "Prefix must be at most 20 characters")
      .regex(/^[A-Za-z0-9]+$/, "Prefix must contain only alphanumeric characters"),

    variants: z.preprocess(
      (val) => (typeof val === "string" ? JSON.parse(val) : val),
      z.array(variantSchema).min(1, "At least one variant is required"),
    ),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
