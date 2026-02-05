import mongodb from "../database/index.mts";
import type {Product} from "./types.ts";
import type { QueryParams } from "../models/types.ts";


async function getAllProducts(query: QueryParams): Promise<Product[] | null> {
    console.log(query);
    const data = (await mongodb.getDb().collection<Product>("products").find({query}).toArray());
    // console.log(data);
    return data ;
}


async function getProductById(id:String):Promise<Product | null> {
    console.log(id);
    const data = (await mongodb.getDb().collection<Product>("products").findOne({ id: id }));
    return data;
}

export default {
    getAllProducts,
    getProductById
};


