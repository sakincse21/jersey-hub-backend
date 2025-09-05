"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = require("express");
const authCheck_1 = require("../../middlewares/authCheck");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = (0, express_1.Router)();
//admin or self
router.get('/', (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IRole)), order_controller_1.OrderControllers.getAllOrders);
//user
router.post('/create', (0, validateRequest_1.validateRequest)(order_validation_1.createOrderZodSchema), order_controller_1.OrderControllers.createOrder);
//by admin or self
router.patch('/cancel/:id', (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IRole)), (0, validateRequest_1.validateRequest)(order_validation_1.cancelOrderZodSchema), order_controller_1.OrderControllers.updateOrder);
//admin
router.patch('/:id', (0, authCheck_1.authCheck)(user_interface_1.IRole.ADMIN), (0, validateRequest_1.validateRequest)(order_validation_1.updateOrderZodSchema), order_controller_1.OrderControllers.updateOrder); //any user
//admin or self
router.get('/:id', (0, authCheck_1.authCheck)(...Object.values(user_interface_1.IRole)), order_controller_1.OrderControllers.getSingleOrder);
//admin
// router.delete('/:id', authCheck(IRole.USER), OrderControllers.deleteOrder)
exports.OrderRouter = router;
