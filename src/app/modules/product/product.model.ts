import { model, Schema } from "mongoose";
import { IProduct, ISize, IVariant } from './product.interface';

const VariantSchema = new Schema<IVariant>({
    size: {
        type: String,
        enum: Object.values(ISize),
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}, { _id: false });

const ProductSchema = new Schema<IProduct>({
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

export const Product = model<IProduct>('Product', ProductSchema);