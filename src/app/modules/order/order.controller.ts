import { catchAsync } from "../../utils/catchAsync"
import httpStatus from 'http-status';
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response, NextFunction } from "express";
import { OrderServices } from "./order.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const order = await OrderServices.createOrder(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Order Created Successfully",
        data: order,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const decodedToken = req.user;
    const orders = await OrderServices.getAllOrders(decodedToken, query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Orders fetched successfully",
        data: orders,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const decodedToken= req.user;
    const orders = await OrderServices.getSingleOrder(decodedToken, orderId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Order fetched successfully",
        data: orders,
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const decodedToken = req.user;
    const order = await OrderServices.updateOrder(orderId, decodedToken, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Order Updated Successfully",
        data: order,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cancelOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const decodedToken = req.user;
    const order = await OrderServices.updateOrder(orderId, decodedToken, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Order Updated Successfully",
        data: order,
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const order = await OrderServices.deleteOrder(orderId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Order Deleted Successfully",
        data: order,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getOrdersSummary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const summary = await OrderServices.getOrdersSummary(decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Orders summary fetched successfully",
        data: summary,
    })
})

export const OrderControllers={
    createOrder, 
    getAllOrders, 
    getSingleOrder, 
    updateOrder, 
    deleteOrder,
    getOrdersSummary
}