"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const express_1 = require("express");
const authCheck_1 = require("../../middlewares/authCheck");
const validateRequest_1 = require("../../middlewares/validateRequest");
const product_validation_1 = require("./product.validation");
const user_interface_1 = require("../user/user.interface");
const product_controller_1 = require("./product.controller");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
//anyone
router.get("/", product_controller_1.ProductControllers.getAllProducts);
//admin
router.post("/create", (0, authCheck_1.authCheck)(user_interface_1.IRole.ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validateRequest)(product_validation_1.createProductZodSchema), product_controller_1.ProductControllers.createProduct);
//admin
router.patch("/:id", (0, authCheck_1.authCheck)(user_interface_1.IRole.ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validateRequest)(product_validation_1.updateProductZodSchema), product_controller_1.ProductControllers.updateProduct); //any user
//anyone
router.get("/:id", product_controller_1.ProductControllers.getSingleProduct);
//admin
router.delete("/:id", (0, authCheck_1.authCheck)(user_interface_1.IRole.ADMIN), product_controller_1.ProductControllers.deleteProduct);
exports.ProductRouter = router;
