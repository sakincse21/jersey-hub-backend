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
exports.ProductControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = require("../../utils/sendResponse");
const product_service_1 = require("./product.service");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const product = yield product_service_1.ProductServices.createProduct(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product Created Successfully",
        data: product,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllProducts = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const products = yield product_service_1.ProductServices.getAllProducts(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product fetched successfully",
        data: products,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSingleProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const products = yield product_service_1.ProductServices.getSingleProduct(productId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product fetched successfully",
        data: products,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProductBySlug = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const products = yield product_service_1.ProductServices.getProductBySlug(slug);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product fetched successfully",
        data: products,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productId = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { images: (_a = req.files) === null || _a === void 0 ? void 0 : _a.map(file => file.path) });
    const product = yield product_service_1.ProductServices.updateProduct(productId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product Updated Successfully",
        data: product,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const product = yield product_service_1.ProductServices.deleteProduct(productId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product Deleted Successfully",
        data: product,
    });
}));
exports.ProductControllers = {
    createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, getProductBySlug
};
