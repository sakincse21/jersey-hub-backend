"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
//frontend(form data with image file)->multer(formdata->body+file in request)->multer keeps the file in a folder also copies the file into its own folder->cloudinary(req.file) niye url provide korbe->mongodb url store
const multer_1 = __importDefault(require("multer"));
const cloudinary_config_1 = require("./cloudinary.config");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            //my image.png -> uniquechars-my-image.png
            const fileName = file.originalname.toLocaleLowerCase()
                .replace(/\s+/g, "-") //removes empty space and places dash
                .replace(/\./g, "-") //removes dot and places dash
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-\.]/g, ""); //removes signs
            const extension = file.originalname.split('.').pop();
            const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension;
            return uniqueFileName;
        },
    },
});
exports.multerUpload = (0, multer_1.default)({ storage: storage });
