import productModel from "../models/product.model.mts";
import type { QueryParams } from "../models/types.ts";
import { buildPaginationWrapper } from "../services/util.mts";

export async function getAllProducts(query: QueryParams) {
  const res = await productModel.getAllProducts(query); //This grabs the data from product.model.mts
  
  if (!res) return null;

  const totalCount = await productModel.getProductCount(query);//This grabs the number of items returned

  // We will use the robust wrapper to generate count, next, and prev links
  const paginatedResponse = buildPaginationWrapper(totalCount, query, res);
  
  console.log("Service Response:", paginatedResponse);
  return paginatedResponse;
}

const getProductById = async (id: string) => {
  return await productModel.getProductById(id);
};

export default {
  getAllProducts,
  getProductById,
};
