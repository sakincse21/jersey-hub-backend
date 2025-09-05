"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductZodSchema = exports.createProductZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const product_interface_1 = require("./product.interface");
const variantSchema = zod_1.default.object({
    size: zod_1.default.enum([...Object.values(product_interface_1.ISize)], {
        invalid_type_error: "Size must be one of: S, M, L, XL, XXL",
    }),
    stock: zod_1.default.number().int().min(0, {
        message: "Stock must be a non-negative integer",
    }),
});
exports.createProductZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string" })
        .min(1, { message: "Name is required" })
        .max(200, { message: "Name cannot exceed 200 characters" }),
    slug: zod_1.default
        .string({ invalid_type_error: "Slug must be a string" })
        .min(1, { message: "Slug is required" })
        .max(200, { message: "Slug cannot exceed 200 characters" })
        .regex(/^[a-z0-9-]+$/, {
        message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
    league: zod_1.default
        .string({ invalid_type_error: "League must be a string" })
        .min(1, { message: "League is required" }),
    team: zod_1.default
        .string({ invalid_type_error: "Team must be a string" })
        .min(1, { message: "Team is required" }),
    price: zod_1.default
        .number({ invalid_type_error: "Price must be a number" })
        .min(0, { message: "Price must be a positive number" }),
    images: zod_1.default
        .array(zod_1.default.string().url({ message: "Each image must be a valid URL" }))
        .min(1, { message: "At least one image is required" }).optional(),
    variants: zod_1.default
        .array(variantSchema)
        .default([]),
    isFeatured: zod_1.default
        .boolean({ invalid_type_error: "isFeatured must be a boolean" })
        .optional(),
});
exports.updateProductZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be a string" })
        .min(1, { message: "Name cannot be empty" })
        .max(200, { message: "Name cannot exceed 200 characters" })
        .optional(),
    slug: zod_1.default
        .string({ invalid_type_error: "Slug must be a string" })
        .min(1, { message: "Slug cannot be empty" })
        .max(200, { message: "Slug cannot exceed 200 characters" })
        .regex(/^[a-z0-9-]+$/, {
        message: "Slug must contain only lowercase letters, numbers, and hyphens",
    })
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
    league: zod_1.default
        .string({ invalid_type_error: "League must be a string" })
        .min(1, { message: "League cannot be empty" })
        .optional(),
    team: zod_1.default
        .string({ invalid_type_error: "Team must be a string" })
        .min(1, { message: "Team cannot be empty" })
        .optional(),
    price: zod_1.default
        .number({ invalid_type_error: "Price must be a number" })
        .min(0, { message: "Price must be a positive number" })
        .optional(),
    images: zod_1.default
        .array(zod_1.default.string().url({ message: "Each image must be a valid URL" }))
        .min(1, { message: "At least one image is required" })
        .optional(),
    variants: zod_1.default
        .array(variantSchema)
        .optional(),
    isFeatured: zod_1.default
        .boolean({ invalid_type_error: "isFeatured must be a boolean" })
        .optional(),
    deleteImages: zod_1.default.array(zod_1.default.string()).optional()
});
