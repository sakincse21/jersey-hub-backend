import { Types } from "mongoose";
import { ISize } from "../product/product.interface";

export enum IPaymentMethod{
    BKASH='BKASH',
    COD='COD'
}
export enum IPaymentStatus {
    PAID= 'PAID',
    UNPAID= 'UNPAID'
}
export enum IOrderStatus {
    PENDING='PENDING',
    CONFIRMED='CONFIRMED',
    SHIPPED='SHIPPED',
    DELIVERED='DELIVERED',
    CANCELLED='CANCELLED'
}

export interface IOrderItem {
  productId: Types.ObjectId;
  size: ISize;
  quantity: number;
}

export interface IOrder {
  userId?: Types.ObjectId;
  name?: string;
  phoneNo?: string;
  items: IOrderItem[];
  amountSubtotal: number;
  amountShipping?: number;
  amountTotal: number;
  paymentMethod: IPaymentMethod;
  paymentStatus: IPaymentStatus;
  bkashTransactionId?: string;
  status: IOrderStatus;
  shippingAddress: string;
  createdAt?: string;
  updatedAt?: string;
}