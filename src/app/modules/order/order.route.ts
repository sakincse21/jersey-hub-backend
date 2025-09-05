import { Router } from "express";
import { authCheck } from "../../middlewares/authCheck";
import { validateRequest } from "../../middlewares/validateRequest";
import { IRole } from "../user/user.interface";
import { OrderControllers } from "./order.controller";
import { cancelOrderZodSchema, createOrderZodSchema, updateOrderZodSchema } from "./order.validation";

const router = Router();

//admin only - orders summary
router.get('/summary', authCheck(IRole.ADMIN), OrderControllers.getOrdersSummary)
//admin or self
router.get('/', authCheck(...Object.values(IRole)), OrderControllers.getAllOrders) 
//user
router.post('/create',validateRequest(createOrderZodSchema), OrderControllers.createOrder)
//by admin or self
router.patch('/cancel/:id',authCheck(...Object.values(IRole)), validateRequest(cancelOrderZodSchema), OrderControllers.updateOrder)
//admin
router.patch('/:id',authCheck(IRole.ADMIN), validateRequest(updateOrderZodSchema), OrderControllers.updateOrder) //any user
//admin or self
router.get('/:id' , authCheck(...Object.values(IRole)),OrderControllers.getSingleOrder)
//admin
// router.delete('/:id', authCheck(IRole.USER), OrderControllers.deleteOrder)


export const OrderRouter = router