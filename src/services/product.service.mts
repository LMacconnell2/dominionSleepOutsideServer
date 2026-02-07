import productModel from "../models/product.model.mts";
import type { QueryParams } from "../models/types.ts";
import type { FindProductObj } from "../models/types.ts";
import { transformResults } from "../services/util.mts";

// const getAllProducts = async () => {
//   return await productModel.getAllProducts();
// };

export async function getAllProducts(query: QueryParams) {

  const res =  await productModel.getAllProducts(query);
  if (!res)
    return
  const tRes = transformResults(res)
  console.log(tRes)
  return tRes;
}

const getProductById = async (id: string) => {
  return await productModel.getProductById(id);
};

export default {
  getAllProducts,
  getProductById,
};
