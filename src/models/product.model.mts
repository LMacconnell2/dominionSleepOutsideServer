import mongodb from "../database/index.mts";
import type { Filter } from "mongodb"; // Necessary for the 'Filter' type
import type { Product, QueryParams } from "./types.ts";
import { formatFields } from "../services/util.mts";

async function getAllProducts(query: QueryParams): Promise<Product[] | null> {
    console.log("getAllProducts:query", query);

    let findProductSearch: Filter<Product> = {};
    if (query.q) {
        findProductSearch = {
            $or: [
                { name: { $regex: query.q, $options: 'i' } },
                { descriptionHtmlSimple: { $regex: query.q, $options: 'i' } },
                { category: { $regex: query.q, $options: 'i' } }
            ]
        };
    }

    const options = {
        limit: Number(query.limit) || 20,
        skip: Number(query.offset) || 0,
        projection: query.fields ? formatFields(query.fields) : {}
    };


    const data = await mongodb.getDb().collection<Product>("products").find(findProductSearch, options).toArray();

    console.log("Data retrieved:", data.length);
    return data;
}


async function getProductById(id: string): Promise<Product | null> {
    // Ensure 'id' matches the field name in your DB (usually _id or id)
    const data = await mongodb.getDb().collection<Product>("products").findOne({ id: id } as Filter<Product>);
    return data;
}

async function getProductCount(query: QueryParams): Promise<number> {
    let filter: Filter<Product> = {};
    if (query.q) {
        filter = {
            $or: [
                { name: { $regex: query.q, $options: 'i' } },
                { descriptionHtmlSimple: { $regex: query.q, $options: 'i' } },
                { category: { $regex: query.q, $options: 'i' } }
            ]
        };
    }
    return await mongodb.getDb().collection("products").countDocuments(filter as any);
}

export default {
    getAllProducts,
    getProductById,
    getProductCount
};


