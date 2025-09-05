import { catchAsync } from "../../utils/catchAsync"
import httpStatus from 'http-status';
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response, NextFunction } from "express";
import { ProductServices } from "./product.service";
import { IProduct } from "./product.interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload : IProduct = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file=>file.path)
    }
    const product = await ProductServices.createProduct(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Product Created Successfully",
        data: product,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const products = await ProductServices.getAllProducts(query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Product fetched successfully",
        data: products,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    const products = await ProductServices.getSingleProduct(productId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Product fetched successfully",
        data: products,
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    const payload : IProduct = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file=>file.path)
    }
    const product = await ProductServices.updateProduct(productId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Product Updated Successfully",
        data: product,
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    const product = await ProductServices.deleteProduct(productId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Product Deleted Successfully",
        data: product,
    })
})

export const ProductControllers={
    createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct
}