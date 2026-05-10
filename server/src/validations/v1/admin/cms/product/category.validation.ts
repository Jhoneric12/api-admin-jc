import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  }),

  params: z.object({
    categoryId: z.string().min(1, "Category ID is required"),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    categoryId: z.string().min(1, "Category ID is required"),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
