"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const order_interface_1 = require("./order.interface");
const product_interface_1 = require("../product/product.interface");
const ItemsSchema = new mongoose_1.Schema({
    size: {
        type: String,
        enum: Object.values(product_interface_1.ISize),
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    items: {
        type: [ItemsSchema],
        required: true
    },
    name: {
        type: String,
    },
    phoneNo: {
        type: String,
        required: true
    },
    amountSubtotal: {
        type: Number,
        required: true
    },
    amountShipping: {
        type: Number,
        default: 100
    },
    amountTotal: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: Object.values(order_interface_1.IPaymentMethod)
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: Object.values(order_interface_1.IPaymentStatus),
        default: order_interface_1.IPaymentStatus.UNPAID
    },
    bkashTransactionId: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(order_interface_1.IOrderStatus),
        default: order_interface_1.IOrderStatus.PENDING
    },
    shippingAddress: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false
});
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
