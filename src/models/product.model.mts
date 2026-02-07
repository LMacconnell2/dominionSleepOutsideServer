import mongodb from "../database/index.mts";
import type {Product} from "./types.ts";
import type { FindProductObj, QueryParams, Projection} from "../models/types.ts";
import { formatFields } from "../services/util.mts";

async function getAllProducts(query: QueryParams): Promise<Product[] | null> {
    console.log("getAllProducts:query");
    console.log(query);

    let findProductSearch;
    let findProductFields;

    if(query.q){
        findProductSearch = {
            name: query.q,
            descriptionHtmlSimple: query.q,
            category: query.q
        }
    }

    const findProductOffset = {
        limit: Number(query.limit || 1),
        offset: Number(query.offset || 0),
    }

    if (query.fields){
            findProductFields = {
            fieldfilters: formatFields(query.fields)
        }
    }

    const data = (await mongodb.getDb().collection<Product>("products").find(findProductSearch, findProductOffset).toArray());
    console.log(data)
    return data ;
}


async function getProductById(id:String):Promise<Product | null> {
    const data = (await mongodb.getDb().collection<Product>("products").findOne({ id: id }));
    return data;
}

export default {
    getAllProducts,
    getProductById
};


