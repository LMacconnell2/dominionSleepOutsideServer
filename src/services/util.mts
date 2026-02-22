import type {Product, QueryParams, User} from "../models/types.ts"
import jwt from "jsonwebtoken";
import Ajv from "ajv";
import addFormats from "ajv-formats"
import addKeywords from "ajv-keywords"
import type { JSONSchema7 } from "json-schema"
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";

export function validator(schema:JSONSchema7 , data:Object) {
    // for some reason typescript doesn't like this even though it is exactly how the documentation says to use these. We are just going to ignore the types for now 🤷🏻‍♂️
    // @ts-ignore
    const ajv = new Ajv();
    // @ts-ignore
    addFormats(ajv);
    // @ts-ignore
    addKeywords(ajv, "instanceof"); 
    const validate = ajv.compile(schema)
    if(!validate(data)) {
        if(validate.errors) {
            // validate.errors is an array.  I've never seen more than one error come back...but just in case we can map over it and pull out the message(s)
            // We need to do this because our errorHandler is expecting a string...not an array of objects.
            const message = validate.errors.map((error:any)=> error.instancePath+" "+error.message).join(", ");
            throw new EntityNotFoundError({message:message, statusCode:400 });
        }
    }
}

function formatFields(fields: string) {
    if (!fields) return {};
    return Object.fromEntries(
        fields.split(',').map(field => [field.trim(), 1])
    );
}

// remember we created a QueryParams interface earlier in types.mts? Import it and use it here again
function buildPaginationWrapper(totalCount: number, query: QueryParams, dataResults: Product[]) {
    const limit = query.limit ? parseInt(query.limit) : 20;
    const offset = query.offset ? parseInt(query.offset) : 0;
    
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.ceil(offset / limit) + 1;
    
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    
    let next = null;
    let prev = null;

    // Use URLSearchParams to preserve other query filters (like ?q=tent)
    const params = new URLSearchParams(query as Record<string, string>);

    if (hasPreviousPage) {
        params.set("offset", (offset - limit).toString());
        prev = `/?${params.toString()}`;
    }
    if (hasNextPage) {
        params.set("offset", (offset + limit).toString());
        next = `/?${params.toString()}`;
    }
        
    return {
        count: totalCount, 
        prev, 
        next, 
        results: dataResults // Pass the actual data here!
    };
}

function sanitize(v:Record<string, any>) {
  if (typeof v === "object") {
      for (var key in v) {
        console.log(key,/^\$/.test(key) )
        if (/^\$/.test(key) ) {
          delete v[key];
        } else {
          sanitize(v[key]);
        }
      }
    }
    return v;
};

function generateToken(user: User) {
    const token = jwt.sign(
        { userId: user._id, userEmail: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    console.log(token);
    return token;
}


export {formatFields, buildPaginationWrapper, sanitize, generateToken};