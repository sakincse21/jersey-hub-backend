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
    const session = yield order_model_1.Order.startSession();
    session.startTransaction();
    try {
        let sum = 0;
        if (payload.items) {
            for (const item of payload.items) {
                const product = yield product_model_1.Product.findById(item.productId).session(session);
                if (!product) {
                    throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, `Product with ID ${item.productId} not found`);
                }
                // Find the variant with the requested size
                const variant = product.variants.find(v => v.size === item.size);
                if (!variant) {
                    throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, `Size ${item.size} not available for product ${product.name}`);
                }
                // Check if sufficient stock is available
                if (variant.stock < item.quantity) {
                    throw new appErrorHandler_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for ${product.name} in size ${item.size}. Available: ${variant.stock}, Requested: ${item.quantity}`);
                }
                // Reduce stock
                variant.stock -= item.quantity;
                // Save the updated product within the session
                yield product.save({ session });
                const price = product.price;
                sum = sum + item.quantity * price;
            }
        }
        const orderData = Object.assign(Object.assign({}, payload), { amountSubtotal: sum, amountTotal: sum + 100, amountShipping: 100 });
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
    console.log(query);
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
    const ifOrderExists = yield order_model_1.Order.findById(orderId).populate({
        path: 'items.productId',
        select: 'name price images'
    });
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
const getOrdersSummary = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    if (decodedToken.role !== user_interface_1.IRole.ADMIN) {
        throw new appErrorHandler_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to access this resource.");
    }
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const [totalOrders, totalRevenue, todayOrders, todayRevenue, weeklyOrders, weeklyRevenue, monthlyOrders, monthlyRevenue, yearlyOrders, yearlyRevenue, ordersByStatus, ordersByPaymentStatus, ordersByPaymentMethod, recentOrders, topProducts] = yield Promise.all([
        // Total orders count
        order_model_1.Order.countDocuments(),
        // Total revenue
        order_model_1.Order.aggregate([
            { $group: { _id: null, total: { $sum: "$amountTotal" } } }
        ]),
        // Today's orders
        order_model_1.Order.countDocuments({ createdAt: { $gte: startOfToday } }),
        // Today's revenue
        order_model_1.Order.aggregate([
            { $match: { createdAt: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: "$amountTotal" } } }
        ]),
        // Weekly orders
        order_model_1.Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
        // Weekly revenue
        order_model_1.Order.aggregate([
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $group: { _id: null, total: { $sum: "$amountTotal" } } }
        ]),
        // Monthly orders
        order_model_1.Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
        // Monthly revenue
        order_model_1.Order.aggregate([
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amountTotal" } } }
        ]),
        // Yearly orders
        order_model_1.Order.countDocuments({ createdAt: { $gte: startOfYear } }),
        // Yearly revenue
        order_model_1.Order.aggregate([
            { $match: { createdAt: { $gte: startOfYear } } },
            { $group: { _id: null, total: { $sum: "$amountTotal" } } }
        ]),
        // Orders by status
        order_model_1.Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]),
        // Orders by payment status
        order_model_1.Order.aggregate([
            { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]),
        // Orders by payment method
        order_model_1.Order.aggregate([
            { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]),
        // Recent orders (last 10)
        order_model_1.Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id items amountTotal status paymentStatus createdAt name'),
        // Top selling products
        order_model_1.Order.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$items.productId",
                    productName: { $first: "$product.name" },
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$product.price"] } }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 }
        ])
    ]);
    return {
        overview: {
            totalOrders,
            totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            averageOrderValue: totalOrders > 0 ? (((_b = totalRevenue[0]) === null || _b === void 0 ? void 0 : _b.total) || 0) / totalOrders : 0
        },
        timeBasedStats: {
            today: {
                orders: todayOrders,
                revenue: ((_c = todayRevenue[0]) === null || _c === void 0 ? void 0 : _c.total) || 0
            },
            thisWeek: {
                orders: weeklyOrders,
                revenue: ((_d = weeklyRevenue[0]) === null || _d === void 0 ? void 0 : _d.total) || 0
            },
            thisMonth: {
                orders: monthlyOrders,
                revenue: ((_e = monthlyRevenue[0]) === null || _e === void 0 ? void 0 : _e.total) || 0
            },
            thisYear: {
                orders: yearlyOrders,
                revenue: ((_f = yearlyRevenue[0]) === null || _f === void 0 ? void 0 : _f.total) || 0
            }
        },
        orderBreakdown: {
            byStatus: ordersByStatus,
            byPaymentStatus: ordersByPaymentStatus,
            byPaymentMethod: ordersByPaymentMethod
        },
        recentOrders,
        topProducts
    };
});
exports.OrderServices = {
    createOrder,
    updateOrder,
    getAllOrders,
    getSingleOrder,
    deleteOrder,
    getOrdersSummary,
};
