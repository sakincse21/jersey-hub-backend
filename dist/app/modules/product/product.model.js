"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const product_interface_1 = require("./product.interface");
const VariantSchema = new mongoose_1.Schema({
    size: {
        type: String,
        enum: Object.values(product_interface_1.ISize),
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}, { _id: false });
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
    },
    league: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true,
    },
    variants: {
        type: [VariantSchema],
        default: []
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Product = (0, mongoose_1.model)('Product', ProductSchema);
