"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderZodSchema = exports.updateOrderZodSchema = exports.createOrderZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const order_interface_1 = require("./order.interface");
const product_interface_1 = require("../product/product.interface");
const orderItemSchema = zod_1.default.object({
    size: zod_1.default.enum([...Object.values(product_interface_1.ISize)]),
    quantity: zod_1.default.number({ invalid_type_error: "Quantity must be number" }).int({ message: 'Quantity must be an integer.' }).min(1),
    productId: zod_1.default.string({ invalid_type_error: "Product ID must be string" }),
});
exports.createOrderZodSchema = zod_1.default.object({
    items: zod_1.default.array(orderItemSchema).min(1),
    paymentMethod: zod_1.default.enum([...Object.values(order_interface_1.IPaymentMethod)]),
    bkashTransactionId: zod_1.default.string().optional(),
    shippingAddress: zod_1.default.string({ invalid_type_error: "Address must be string" }).min(1),
    name: zod_1.default.string({ invalid_type_error: "Name must be a string" }).min(3).max(200),
    userId: zod_1.default.string({ invalid_type_error: "User ID must be a string" }).min(3).max(200).optional(),
    phoneNo: zod_1.default
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
    }),
});
exports.updateOrderZodSchema = zod_1.default.object({
    items: zod_1.default.array(orderItemSchema).min(1).optional(),
    amountSubtotal: zod_1.default.number().min(0).optional(),
    amountShipping: zod_1.default.number().min(0).optional(),
    amountTotal: zod_1.default.number().min(0).optional(),
    paymentMethod: zod_1.default.enum([...Object.values(order_interface_1.IPaymentMethod)]).optional(),
    paymentStatus: zod_1.default.enum([...Object.values(order_interface_1.IPaymentStatus)]).optional(),
    bkashTransactionId: zod_1.default.string().optional(),
    status: zod_1.default.enum([...Object.values(order_interface_1.IOrderStatus)]).optional(),
    shippingAddress: zod_1.default.string().min(1).optional(),
});
exports.cancelOrderZodSchema = zod_1.default.object({
    status: zod_1.default.enum([order_interface_1.IOrderStatus.CANCELLED]).optional(),
});
