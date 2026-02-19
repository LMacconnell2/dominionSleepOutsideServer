import mongodb from "../database/index.mts";
import type { User } from "../models/types.ts";


async function getAllUsers() {
    // console.log("getAllProducts:query", query);

    // let findProductSearch: Filter<Product> = {};
    // if (query.q) {
    //     findProductSearch = {
    //         $or: [
    //             { name: { $regex: query.q, $options: 'i' } },
    //             { descriptionHtmlSimple: { $regex: query.q, $options: 'i' } },
    //             { category: { $regex: query.q, $options: 'i' } }
    //         ]
    //     };
    // }

    // const options = {
    //     limit: Number(query.limit) || 20,
    //     skip: Number(query.offset) || 0,
    //     projection: query.fields ? formatFields(query.fields) : {}
    // };


    // const data = await mongodb.getDb().collection<Product>("products").find(findProductSearch, options).toArray();

    // console.log("Data retrieved:", data.length);
    // return data;
}

async function getUserByEmail(email: string): Promise<User | null> {
    // Ensure 'id' matches the field name in your DB (usually _id or id)
    const data = await mongodb.getDb().collection<User>("users").findOne({ email: email });
    return data;
}

export { getUserByEmail };