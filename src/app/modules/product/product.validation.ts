import z from "zod";
import { ISize } from './product.interface';

const variantSchema = z.object({
  size: z.enum([...Object.values(ISize)] as [string, ...string[]], {
    invalid_type_error: "Size must be one of: S, M, L, XL, XXL",
  }),
  stock: z.number().int().min(0, {
    message: "Stock must be a non-negative integer",
  }),
});

export const createProductZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(1, { message: "Name is required" })
    .max(200, { message: "Name cannot exceed 200 characters" }),
  slug: z
    .string({ invalid_type_error: "Slug must be a string" })
    .min(1, { message: "Slug is required" })
    .max(200, { message: "Slug cannot exceed 200 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),
  league: z
    .string({ invalid_type_error: "League must be a string" })
    .min(1, { message: "League is required" }),
  team: z
    .string({ invalid_type_error: "Team must be a string" })
    .min(1, { message: "Team is required" }),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, { message: "Price must be a positive number" }),
  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .min(1, { message: "At least one image is required" }).optional(),
  variants: z
    .array(variantSchema)
    .default([]),
  isFeatured: z
    .boolean({ invalid_type_error: "isFeatured must be a boolean" })
    .optional(),
});

export const updateProductZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(1, { message: "Name cannot be empty" })
    .max(200, { message: "Name cannot exceed 200 characters" })
    .optional(),
  slug: z
    .string({ invalid_type_error: "Slug must be a string" })
    .min(1, { message: "Slug cannot be empty" })
    .max(200, { message: "Slug cannot exceed 200 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),
  league: z
    .string({ invalid_type_error: "League must be a string" })
    .min(1, { message: "League cannot be empty" })
    .optional(),
  team: z
    .string({ invalid_type_error: "Team must be a string" })
    .min(1, { message: "Team cannot be empty" })
    .optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, { message: "Price must be a positive number" })
    .optional(),
  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .min(1, { message: "At least one image is required" })
    .optional(),
  variants: z
    .array(variantSchema)
    .optional(),
  isFeatured: z
    .boolean({ invalid_type_error: "isFeatured must be a boolean" })
    .optional(),
    deleteImages: z.array(z.string()).optional()
});
