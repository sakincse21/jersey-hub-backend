import { Router } from "express";
import { authCheck } from "../../middlewares/authCheck";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createProductZodSchema,
  updateProductZodSchema,
} from "./product.validation";
import { IRole } from "../user/user.interface";
import { ProductControllers } from "./product.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

//anyone
router.get("/", ProductControllers.getAllProducts);
//admin
router.post(
  "/create",
  authCheck(IRole.ADMIN),
  multerUpload.array("files"),
  validateRequest(createProductZodSchema),
  ProductControllers.createProduct
);
//admin
router.patch(
  "/:id",
  authCheck(IRole.ADMIN),
  multerUpload.array("files"),
  validateRequest(updateProductZodSchema),
  ProductControllers.updateProduct
);
//anyone
router.get("/byslug/:slug", ProductControllers.getProductBySlug);
router.get("/:id", ProductControllers.getSingleProduct);
//admin
router.delete("/:id", authCheck(IRole.ADMIN), ProductControllers.deleteProduct);

export const ProductRouter = router;
