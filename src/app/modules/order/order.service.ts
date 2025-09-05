import AppError from "../../errorHelpers/appErrorHandler";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Product } from "../product/product.model";
import { IRole } from "../user/user.interface";
import { User } from "../user/user.model";
import { orderSearchableFields } from "./order.constant";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

//anyone can create a user uing his phone, nid, email and other info
const createOrder = async (payload: Partial<IOrder>) => {
  let sum = 0;
  
  if (payload.items) {
    for (const item of payload.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new AppError(httpStatus.BAD_REQUEST, `Product with ID ${item.productId} not found`);
      }
      const price = product.price;
      sum = sum + (item.quantity * price);
    }
  }
  
  const orderData = {
    ...payload,
    amountSubtotal: sum,
    amountTotal: sum + 100,
    amountShipping: 100,
  };
  const session = await Order.startSession();
  session.startTransaction();
  try {
    const OrderArray = await Order.create([orderData], {
      session,
    });

    const order = OrderArray[0];

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateOrder = async (
  orderId: string,
  decodedToken: JwtPayload,
  payload: Partial<IOrder>
) => {
  const session = await Order.startSession();
  session.startTransaction();
  try {
    const ifOrderExist = await Order.findById(orderId);

    if (!ifOrderExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Order does not exist.");
    }
    if (ifOrderExist?.userId?.toString() !== decodedToken.userId) {
      if (decodedToken.role !== IRole.ADMIN) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You are not permitted for this operation."
        );
      }
    }
    const order = await Order.findByIdAndUpdate(ifOrderExist._id, payload, {
      new: true,
      runValidators: true,
      session,
    });

    if (!order) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Order is not updated. Try again."
      );
    }
    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllOrders = async (
  decodedToken: JwtPayload,
  query: Record<string, string>
) => {
  const userId = decodedToken.userId;
  const ifUserExists = await User.findById(userId);
  if (!ifUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists.");
  }

  let params;
  if (decodedToken.role === IRole.ADMIN) {
    // allTransactions = await Transaction.find({});
    params = {};
  } else {
    // allTransactions = await Transaction.find({
    //   $or: [{ from: walletId }, { to: walletId }],
    // });
    params = {
      userId: ifUserExists._id,
    };
  }

  const queryBuilder = new QueryBuilder(Order.find(params), query);
  const ordersData = queryBuilder
    .filter()
    .search(orderSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    ordersData.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleOrder = async (decodedToken: JwtPayload, orderId: string) => {
  const ifOrderExists = await Order.findById(orderId);
  if (!ifOrderExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID does not exist.");
  }
  if (ifOrderExists.userId?.toString() !== decodedToken.userId) {
    if (decodedToken.role !== IRole.ADMIN) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not permitted for this operation."
      );
    }
  }

  return ifOrderExists.toObject();
};

const deleteOrder = async (orderId: string) => {
  const ifOrderExist = await Order.findById(orderId);

  if (!ifOrderExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order does not exist.");
  }

  const order = await Order.findByIdAndDelete(ifOrderExist._id);

  if (order) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Order is not deleted. Try again."
    );
  }
  return order;
};

export const OrderServices = {
  createOrder,
  updateOrder,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
};
