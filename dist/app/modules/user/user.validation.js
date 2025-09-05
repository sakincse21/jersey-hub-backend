"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminZodSchema = exports.updatePasswordZodSchema = exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
//Normal User Section
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." })
        .toLowerCase()
        .optional(),
    password: zod_1.default
        .string({ invalid_type_error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    phoneNo: zod_1.default
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: 01XXXXXXXXX",
    }),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    role: zod_1.default
        .enum([user_interface_1.IRole.USER, user_interface_1.IRole.ADMIN], {
        invalid_type_error: "Role must be a string",
    }).optional()
});
//anyone basic info update
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    email: zod_1.default
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." })
        .optional(),
    phoneNo: zod_1.default
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }).optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
});
//anyone can change his password
exports.updatePasswordZodSchema = zod_1.default.object({
    oldPassword: zod_1.default
        .string({ invalid_type_error: "oldPassword must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    newPassword: zod_1.default
        .string({ invalid_type_error: "oldPassword must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
});
//Admin Access Only Section
exports.updateAdminZodSchema = zod_1.default.object({
    role: zod_1.default
        .enum([...Object.values(user_interface_1.IRole)], {
        invalid_type_error: "Role must be a string",
    })
        .optional(),
    status: zod_1.default
        .enum([...Object.values(user_interface_1.IStatus)], {
        invalid_type_error: "Status must be a string",
    })
        .optional(),
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    email: zod_1.default
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." })
        .optional(),
    phoneNo: zod_1.default
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }).optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
});
// export const createAdminZodSchema = z.object({
//   name: z
//     .string({ invalid_type_error: "Name must be string" })
//     .min(2, { message: "Name must be at least 2 characters long." })
//     .max(50, { message: "Name cannot exceed 50 characters." }),
//   email: z
//     .string({ invalid_type_error: "Email must be string" })
//     .email({ message: "Invalid email address format." })
//     .min(5, { message: "Email must be at least 5 characters long." })
//     .max(100, { message: "Email cannot exceed 100 characters." }),
//   password: z
//     .string({ invalid_type_error: "Password must be string" })
//     .min(8, { message: "Password must be at least 8 characters long." })
//     .regex(/^(?=.*[A-Z])/, {
//       message: "Password must contain at least 1 uppercase letter.",
//     })
//     .regex(/^(?=.*[!@#$%^&*])/, {
//       message: "Password must contain at least 1 special character.",
//     })
//     .regex(/^(?=.*\d)/, {
//       message: "Password must contain at least 1 number.",
//     }),
//   phoneNo: z
//     .string({ invalid_type_error: "Phone Number must be string" })
//     .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
//       message:
//         "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
//     }),
//   address: z
//     .string({ invalid_type_error: "Address must be string" })
//     .max(200, { message: "Address cannot exceed 200 characters." })
//     .optional(),
//   nidNo: z.union([
//     z
//       .string({ invalid_type_error: "NID must be string" })
//       .length(13, { message: "NID length must be 13 or 17 characters long." }),
//     z
//       .string({ invalid_type_error: "NID must be string" })
//       .length(17, { message: "NID length must be 13 or 17 characters long." }),
//   ]),
// });
