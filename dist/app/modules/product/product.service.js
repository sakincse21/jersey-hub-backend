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
exports.ProductServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const appErrorHandler_1 = __importDefault(require("../../errorHelpers/appErrorHandler"));
const queryBuilder_1 = require("../../utils/queryBuilder");
const product_constant_1 = require("./product.constant");
const product_model_1 = require("./product.model");
const http_status_1 = __importDefault(require("http-status"));
//anyone can create a user uing his phone, nid, email and other info
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield product_model_1.Product.startSession();
    session.startTransaction();
    try {
        const ifProductExist = yield product_model_1.Product.findOne({ slug: payload.slug });
        if (ifProductExist) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Product already exists.");
        }
        const ProductArray = yield product_model_1.Product.create([payload], {
            session,
        });
        const product = ProductArray[0];
        yield session.commitTransaction();
        session.endSession();
        return product;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateProduct = (productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield product_model_1.Product.startSession();
    session.startTransaction();
    try {
        const ifProductExist = yield product_model_1.Product.findById(productId);
        if (!ifProductExist) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Product does not exist.");
        }
        if (payload.images &&
            payload.images.length &&
            ifProductExist.images &&
            ifProductExist.images.length) {
            payload.images = [...ifProductExist.images, ...payload.images];
        }
        if (payload.deleteImages &&
            payload.deleteImages.length &&
            ifProductExist.images &&
            ifProductExist.images.length &&
            ifProductExist.images.length >= payload.deleteImages.length) {
            const restDBImages = ifProductExist.images.filter((imageUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
            const updatedPayloadImages = (payload.images || [])
                .filter((imageUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
                .filter((imageUrl) => !restDBImages.includes(imageUrl));
            payload.images = [...restDBImages, ...updatedPayloadImages];
        }
        (_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.map(img => (0, cloudinary_config_1.deleteImageFromCloudinary)(img));
        const product = yield product_model_1.Product.findByIdAndUpdate(ifProductExist._id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        if (!product) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Product is not updated. Try again.");
        }
        yield session.commitTransaction();
        session.endSession();
        return product;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(product_model_1.Product.find(), query);
    const productsData = queryBuilder
        .filter()
        .search(product_constant_1.productSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        productsData.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getSingleProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield product_model_1.Product.findById(productId); //order er jinish dite hbe
    if (!user) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Product does not exist.");
    }
    return user.toObject();
});
const getProductBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield product_model_1.Product.findOne({ slug }); //order er jinish dite hbe
    if (!user) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Product does not exist.");
    }
    return user.toObject();
});
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const ifProductExist = yield product_model_1.Product.findById(productId);
    if (!ifProductExist) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Product does not exist.");
    }
    const images = ifProductExist.images;
    images.forEach(img => (0, cloudinary_config_1.deleteImageFromCloudinary)(img));
    const product = yield product_model_1.Product.findByIdAndDelete(ifProductExist._id);
    if (!product) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Product is not deleted. Try again.");
    }
    return product;
});
exports.ProductServices = {
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    getProductBySlug
};
