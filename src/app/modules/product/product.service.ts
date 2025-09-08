import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/appErrorHandler";
import { QueryBuilder } from "../../utils/queryBuilder";
import { productSearchableFields } from "./product.constant";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatus from "http-status";

//anyone can create a user uing his phone, nid, email and other info
const createProduct = async (payload: Partial<IProduct>) => {
  const session = await Product.startSession();
  session.startTransaction();
  try {
    const ifProductExist = await Product.findOne({ slug: payload.slug });

    if (ifProductExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Product already exists.");
    }

    const ProductArray = await Product.create([payload], {
      session,
    });

    const product = ProductArray[0];

    await session.commitTransaction();
    session.endSession();

    return product;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateProduct = async (productId: string, payload: Partial<IProduct> & { deleteImages?: string[] }) => {
  const session = await Product.startSession();
  session.startTransaction();
  try {
    const ifProductExist = await Product.findById(productId);

    if (!ifProductExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Product does not exist.");
    }

    if (
      payload.images &&
      payload.images.length &&
      ifProductExist.images &&
      ifProductExist.images.length
    ) {
      payload.images = [...ifProductExist.images, ...payload.images];
    }

    if (
      payload.deleteImages &&
      payload.deleteImages.length &&
      ifProductExist.images &&
      ifProductExist.images.length &&
      ifProductExist.images.length >= payload.deleteImages.length
    ) {
      const restDBImages = ifProductExist.images.filter(
        (imageUrl) => !payload.deleteImages?.includes(imageUrl)
      );
      const updatedPayloadImages = (payload.images || [])
        .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
        .filter((imageUrl) => !restDBImages.includes(imageUrl));

      payload.images = [...restDBImages, ...updatedPayloadImages];
    }

    payload.deleteImages?.map(img=>deleteImageFromCloudinary(img))

    const product = await Product.findByIdAndUpdate(
      ifProductExist._id,
      payload,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!product) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Product is not updated. Try again."
      );
    }
    await session.commitTransaction();
    session.endSession();

    return product;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllProducts = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Product.find(), query);
  const productsData = queryBuilder
    .filter()
    .search(productSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    productsData.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleProduct = async (productId: string) => {
  const user = await Product.findById(productId); //order er jinish dite hbe

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product does not exist.");
  }

  return user.toObject();
};

const getProductBySlug = async (slug: string) => {
  const user = await Product.findOne({slug}); //order er jinish dite hbe

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product does not exist.");
  }

  return user.toObject();
};

const deleteProduct = async (productId: string) => {
  const ifProductExist = await Product.findById(productId);

  if (!ifProductExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product does not exist.");
  }

  const images : string[] = ifProductExist.images;

  images.forEach(img=> deleteImageFromCloudinary(img))

  const product = await Product.findByIdAndDelete(ifProductExist._id);

  if (!product) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product is not deleted. Try again."
    );
  }
  return product;
};

export const ProductServices = {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  getProductBySlug
};
