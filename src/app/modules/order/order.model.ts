import { model, Schema } from 'mongoose';
import { IOrder, IOrderItem, IOrderStatus, IPaymentMethod, IPaymentStatus } from "./order.interface";
import { ISize } from '../product/product.interface';

const ItemsSchema = new Schema<IOrderItem>({
    size: {
        type: String,
        enum: Object.values(ISize),
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    userId: {
        type: Schema.Types.ObjectId,
    },
    items: {
        type: [ItemsSchema],
        required: true
    },
    name: {
        type: String,
    },
    phoneNo: {
        type: String,
        required: true
    },
    amountSubtotal: {
        type: Number,
        required: true
    },
    amountShipping: {
        type: Number,
        default: 100
    },
    amountTotal: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: Object.values(IPaymentMethod)
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: Object.values(IPaymentStatus),
        default: IPaymentStatus.UNPAID
    },
    bkashTransactionId: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(IOrderStatus),
        default: IOrderStatus.PENDING
    },
    shippingAddress: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false
});

export const Order = model<IOrder>('Order', OrderSchema);