"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRouter = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const product_route_1 = require("../modules/product/product.route");
const order_route_1 = require("../modules/order/order.route");
const routes = [
    {
        path: "/user",
        router: user_route_1.UserRouter
    },
    {
        path: "/auth",
        router: auth_route_1.AuthRouter
    },
    {
        path: "/product",
        router: product_route_1.ProductRouter
    },
    {
        path: "/order",
        router: order_route_1.OrderRouter
    },
];
const router = (0, express_1.Router)();
routes.forEach((route) => {
    router.use(route.path, route.router);
});
exports.AppRouter = router;
