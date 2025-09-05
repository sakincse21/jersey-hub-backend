
import z from "zod";
import { IOrderStatus, IPaymentMethod, IPaymentStatus } from "./order.interface";
import { ISize } from "../product/product.interface";

const orderItemSchema = z.object({
  size: z.enum([...Object.values(ISize)] as [string, ...string[]]),
  quantity: z.number({ invalid_type_error: "Quantity must be number" }).int({message:'Quantity must be an integer.'}).min(1),
  productId: z.string({ invalid_type_error: "Product ID must be string" }),
});

export const createOrderZodSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  paymentMethod: z.enum([...Object.values(IPaymentMethod)] as [string, ...string[]]),
  bkashTransactionId: z.string().optional(),
  shippingAddress: z.string({ invalid_type_error: "Address must be string" }).min(1),
  name: z.string({invalid_type_error:"Name must be a string"}).min(3).max(200),
  userId: z.string({invalid_type_error:"User ID must be a string"}).min(3).max(200).optional(),
  phoneNo: z
      .string({ invalid_type_error: "Phone Number must be string" })
      .regex(/^(?:01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
      }),
});

export const updateOrderZodSchema = z.object({
  items: z.array(orderItemSchema).min(1).optional(),
  amountSubtotal: z.number().min(0).optional(),
  amountShipping: z.number().min(0).optional(),
  amountTotal: z.number().min(0).optional(),
  paymentMethod: z.enum([...Object.values(IPaymentMethod)] as [string, ...string[]]).optional(),
  paymentStatus: z.enum([...Object.values(IPaymentStatus)] as [string, ...string[]]).optional(),
  bkashTransactionId: z.string().optional(),
  status: z.enum([...Object.values(IOrderStatus)] as [string, ...string[]]).optional(),
  shippingAddress: z.string().min(1).optional(),
});

export const cancelOrderZodSchema = z.object({
  status: z.enum([IOrderStatus.CANCELLED]).optional(),
});
