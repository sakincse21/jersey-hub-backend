import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { ProductRouter } from "../modules/product/product.route";
import { OrderRouter } from "../modules/order/order.route";

const routes= [
    {
        path: "/user",
        router: UserRouter
    },
    {
        path: "/auth",
        router: AuthRouter
    },
    {
        path: "/product",
        router: ProductRouter
    },
    {
        path: "/order",
        router: OrderRouter
    },
]

const router = Router();

routes.forEach((route) => {
    router.use(route.path, route.router)
})
export const AppRouter = router;