"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOrderStatus = exports.IPaymentStatus = exports.IPaymentMethod = void 0;
var IPaymentMethod;
(function (IPaymentMethod) {
    IPaymentMethod["BKASH"] = "BKASH";
    IPaymentMethod["COD"] = "COD";
})(IPaymentMethod || (exports.IPaymentMethod = IPaymentMethod = {}));
var IPaymentStatus;
(function (IPaymentStatus) {
    IPaymentStatus["PAID"] = "PAID";
    IPaymentStatus["UNPAID"] = "UNPAID";
})(IPaymentStatus || (exports.IPaymentStatus = IPaymentStatus = {}));
var IOrderStatus;
(function (IOrderStatus) {
    IOrderStatus["PENDING"] = "PENDING";
    IOrderStatus["CONFIRMED"] = "CONFIRMED";
    IOrderStatus["SHIPPED"] = "SHIPPED";
    IOrderStatus["DELIVERED"] = "DELIVERED";
    IOrderStatus["CANCELLED"] = "CANCELLED";
    IOrderStatus["REFUNDED"] = "REFUNDED";
})(IOrderStatus || (exports.IOrderStatus = IOrderStatus = {}));
