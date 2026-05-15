import { z } from "zod";

export const createUnitSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
    abbreviation: z.string().min(1, "Abbreviation is required").max(20, "Abbreviation must be at most 20 characters"),
  }),
});

export const updateUnitSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters").optional(),
    abbreviation: z
      .string()
      .min(1, "Abbreviation is required")
      .max(20, "Abbreviation must be at most 20 characters")
      .optional(),
  }),

  params: z.object({
    unitId: z.string().min(1, "Unit ID is required"),
  }),
});

export const deleteUnitSchema = z.object({
  params: z.object({
    unitId: z.string().min(1, "Unit ID is required"),
  }),
});

export const getUnitsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
  }),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
export type DeleteUnitInput = z.infer<typeof deleteUnitSchema>;
export type GetUnitsInput = z.infer<typeof getUnitsSchema>;
