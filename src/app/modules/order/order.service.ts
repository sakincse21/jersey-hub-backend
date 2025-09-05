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
  const session = await Order.startSession();
  session.startTransaction();
  try {
    let sum = 0;

    if (payload.items) {
      for (const item of payload.items) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Product with ID ${item.productId} not found`
          );
        }

        // Find the variant with the requested size
        const variant = product.variants.find(v => v.size === item.size);
        if (!variant) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Size ${item.size} not available for product ${product.name}`
          );
        }

        // Check if sufficient stock is available
        if (variant.stock < item.quantity) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Insufficient stock for ${product.name} in size ${item.size}. Available: ${variant.stock}, Requested: ${item.quantity}`
          );
        }

        // Reduce stock
        variant.stock -= item.quantity;

        // Save the updated product within the session
        await product.save({ session });

        const price = product.price;
        sum = sum + item.quantity * price;
      }
    }

    const orderData = {
      ...payload,
      amountSubtotal: sum,
      amountTotal: sum + 100,
      amountShipping: 100,
    };

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

const getOrdersSummary = async (decodedToken: JwtPayload) => {
  if (decodedToken.role !== IRole.ADMIN) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to access this resource."
    );
  }
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalOrders,
    totalRevenue,
    todayOrders,
    todayRevenue,
    weeklyOrders,
    weeklyRevenue,
    monthlyOrders,
    monthlyRevenue,
    yearlyOrders,
    yearlyRevenue,
    ordersByStatus,
    ordersByPaymentStatus,
    ordersByPaymentMethod,
    recentOrders,
    topProducts
  ] = await Promise.all([
    // Total orders count
    Order.countDocuments(),
    
    // Total revenue
    Order.aggregate([
      { $group: { _id: null, total: { $sum: "$amountTotal" } } }
    ]),
    
    // Today's orders
    Order.countDocuments({ createdAt: { $gte: startOfToday } }),
    
    // Today's revenue
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: "$amountTotal" } } }
    ]),
    
    // Weekly orders
    Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
    
    // Weekly revenue
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: "$amountTotal" } } }
    ]),
    
    // Monthly orders
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    
    // Monthly revenue
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amountTotal" } } }
    ]),
    
    // Yearly orders
    Order.countDocuments({ createdAt: { $gte: startOfYear } }),
    
    // Yearly revenue
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: "$amountTotal" } } }
    ]),
    
    // Orders by status
    Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    
    // Orders by payment status
    Order.aggregate([
      { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    
    // Orders by payment method
    Order.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    
    // Recent orders (last 10)
    Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('_id items amountTotal status paymentStatus createdAt name'),
    
    // Top selling products
    Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$product.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$product.price"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ])
  ]);

  return {
    overview: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0
    },
    timeBasedStats: {
      today: {
        orders: todayOrders,
        revenue: todayRevenue[0]?.total || 0
      },
      thisWeek: {
        orders: weeklyOrders,
        revenue: weeklyRevenue[0]?.total || 0
      },
      thisMonth: {
        orders: monthlyOrders,
        revenue: monthlyRevenue[0]?.total || 0
      },
      thisYear: {
        orders: yearlyOrders,
        revenue: yearlyRevenue[0]?.total || 0
      }
    },
    orderBreakdown: {
      byStatus: ordersByStatus,
      byPaymentStatus: ordersByPaymentStatus,
      byPaymentMethod: ordersByPaymentMethod
    },
    recentOrders,
    topProducts
  };
};

export const OrderServices = {
  createOrder,
  updateOrder,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
  getOrdersSummary,
};
