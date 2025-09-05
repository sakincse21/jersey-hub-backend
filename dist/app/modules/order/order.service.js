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
exports.OrderServices = void 0;
const appErrorHandler_1 = __importDefault(require("../../errorHelpers/appErrorHandler"));
const queryBuilder_1 = require("../../utils/queryBuilder");
const product_model_1 = require("../product/product.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const order_constant_1 = require("./order.constant");
const order_model_1 = require("./order.model");
const http_status_1 = __importDefault(require("http-status"));
//anyone can create a user uing his phone, nid, email and other info
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let sum = 0;
    if (payload.items) {
        for (const item of payload.items) {
            const product = yield product_model_1.Product.findById(item.productId);
            if (!product) {
                throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, `Product with ID ${item.productId} not found`);
            }
            const price = product.price;
            sum = sum + (item.quantity * price);
        }
    }
    const orderData = Object.assign(Object.assign({}, payload), { amountSubtotal: sum, amountTotal: sum + 100, amountShipping: 100 });
    const session = yield order_model_1.Order.startSession();
    session.startTransaction();
    try {
        const OrderArray = yield order_model_1.Order.create([orderData], {
            session,
        });
        const order = OrderArray[0];
        yield session.commitTransaction();
        session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateOrder = (orderId, decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield order_model_1.Order.startSession();
    session.startTransaction();
    try {
        const ifOrderExist = yield order_model_1.Order.findById(orderId);
        if (!ifOrderExist) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Order does not exist.");
        }
        if (((_a = ifOrderExist === null || ifOrderExist === void 0 ? void 0 : ifOrderExist.userId) === null || _a === void 0 ? void 0 : _a.toString()) !== decodedToken.userId) {
            if (decodedToken.role !== user_interface_1.IRole.ADMIN) {
                throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You are not permitted for this operation.");
            }
        }
        const order = yield order_model_1.Order.findByIdAndUpdate(ifOrderExist._id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        if (!order) {
            throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Order is not updated. Try again.");
        }
        yield session.commitTransaction();
        session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllOrders = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.userId;
    const ifUserExists = yield user_model_1.User.findById(userId);
    if (!ifUserExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "User does not exists.");
    }
    let params;
    if (decodedToken.role === user_interface_1.IRole.ADMIN) {
        // allTransactions = await Transaction.find({});
        params = {};
    }
    else {
        // allTransactions = await Transaction.find({
        //   $or: [{ from: walletId }, { to: walletId }],
        // });
        params = {
            userId: ifUserExists._id,
        };
    }
    const queryBuilder = new queryBuilder_1.QueryBuilder(order_model_1.Order.find(params), query);
    const ordersData = queryBuilder
        .filter()
        .search(order_constant_1.orderSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        ordersData.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getSingleOrder = (decodedToken, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ifOrderExists = yield order_model_1.Order.findById(orderId);
    if (!ifOrderExists) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Order ID does not exist.");
    }
    if (((_a = ifOrderExists.userId) === null || _a === void 0 ? void 0 : _a.toString()) !== decodedToken.userId) {
        if (decodedToken.role !== user_interface_1.IRole.ADMIN) {
            throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You are not permitted for this operation.");
        }
    }
    return ifOrderExists.toObject();
});
const deleteOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const ifOrderExist = yield order_model_1.Order.findById(orderId);
    if (!ifOrderExist) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Order does not exist.");
    }
    const order = yield order_model_1.Order.findByIdAndDelete(ifOrderExist._id);
    if (order) {
        throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, "Order is not deleted. Try again.");
    }
    return order;
});
exports.OrderServices = {
    createOrder,
    updateOrder,
    getAllOrders,
    getSingleOrder,
    deleteOrder,
};
