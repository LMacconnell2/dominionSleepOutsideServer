import type {Product, QueryParams, User} from "../models/types.ts"
import jwt from "jsonwebtoken";

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