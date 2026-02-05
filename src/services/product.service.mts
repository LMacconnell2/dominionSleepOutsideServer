import productModel from "../models/product.model.mts";
import type { QueryParams } from "../models/types.ts";

// const getAllProducts = async () => {
//   return await productModel.getAllProducts();
// };

export async function getAllProducts(query: QueryParams) {
  return await productModel.getAllProducts(query);
}

const getProductById = async (id: string) => {
  return await productModel.getProductById(id);
};

export default {
  getAllProducts,
  getProductById,
};
