"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = require("../../utils/sendResponse");
const order_service_1 = require("./order.service");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createOrder = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.OrderServices.createOrder(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Order Created Successfully",
        data: order,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllOrders = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const decodedToken = req.user;
    const orders = yield order_service_1.OrderServices.getAllOrders(decodedToken, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Orders fetched successfully",
        data: orders,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleOrder = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const decodedToken = req.user;
    const orders = yield order_service_1.OrderServices.getSingleOrder(decodedToken, orderId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Order fetched successfully",
        data: orders,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateOrder = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const decodedToken = req.user;
    const order = yield order_service_1.OrderServices.updateOrder(orderId, decodedToken, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order Updated Successfully",
        data: order,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cancelOrder = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const decodedToken = req.user;
    const order = yield order_service_1.OrderServices.updateOrder(orderId, decodedToken, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order Updated Successfully",
        data: order,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteOrder = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const order = yield order_service_1.OrderServices.deleteOrder(orderId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order Deleted Successfully",
        data: order,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getOrdersSummary = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const summary = yield order_service_1.OrderServices.getOrdersSummary(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Orders summary fetched successfully",
        data: summary,
    });
}));
exports.OrderControllers = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder,
    getOrdersSummary
};
