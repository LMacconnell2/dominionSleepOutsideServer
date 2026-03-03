import mongodb from "../database/index.mts";
import type { Filter } from "mongodb"; // Necessary for the 'Filter' type
import type { Product, QueryParams } from "./types.ts";
import { formatFields } from "../services/util.mts";


function buildSearchFilter(query: QueryParams): Filter<Product> {
    const filter: Filter<Product> = {};

    if (query.category?.trim()) {
        filter.category = { $regex: query.category, $options: "i" };
    }

    if (query.q?.trim()) {
        filter.$or = [
            { name: { $regex: query.q, $options: "i" } },
            { descriptionHtmlSimple: { $regex: query.q, $options: "i" } },
            { category: { $regex: query.q, $options: "i" } }
        ];
    }

    return filter;
}


async function getAllProducts(query: QueryParams): Promise<Product[] | null> {
    console.log("getAllProducts:query", query);
    const filter = buildSearchFilter(query);

    const options = {
        limit: Number(query.limit) || 30,
        skip: Number(query.offset) || 0,
        projection: query.fields ? formatFields(query.fields) : {}
    };

    const data = await mongodb.getDb().collection<Product>("products").find(filter, options).toArray();

    console.log("Data retrieved:", data.length);
    return data;
}


async function getProductById(id: string): Promise<Product | null> {
    // Ensure 'id' matches the field name in your DB (usually _id or id)
    const data = await mongodb.getDb().collection<Product>("products").findOne({ id: id } as Filter<Product>);
    return data;
}

async function getProductCount(query: QueryParams): Promise<number> {
    const filter = buildSearchFilter(query);
    console.log("filter2:", JSON.stringify(filter)); // confirm filter shape

    return await mongodb.getDb().collection("products").countDocuments(filter as any);
}

export default {
    getAllProducts,
    getProductById,
    getProductCount
};


