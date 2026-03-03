import mongodb from "../database/index.mts";
import { UserSchema } from "../database/json-Schema.ts";
import type { User } from "../models/types.ts";
import argon2 from "argon2";
import { validator } from "../services/util.mts";


async function getUserByEmail(email: string): Promise<User | null> {
    // Ensure 'id' matches the field name in your DB (usually _id or id)
    const data = await mongodb.getDb().collection<User>("users").findOne({ 
        email: email.toLowerCase() 
    });
    const count = await mongodb.getDb().collection("users").countDocuments({ email: email });
    console.log("count", count);
    console.log("getUserByEmail:data", data);
    return data;
}

async function addUser(email: string, password: string, name: string) {
    const userExist = await getUserByEmail(email);
    if (userExist) {
        console.error('User Already Exists');
        return;
    }
    const hashedPassword = await argon2.hash(password);
    const user = {
        email,
        password: hashedPassword,
        name,
        createdAt: new Date(),
        modifiedAt: new Date(),
    }
    validator(UserSchema, user);
    const newUser = await mongodb.getDb().collection<User>("users").insertOne(user);
    if (!newUser) {
        console.error("Failed to create user");
    }
    console.log("User created", newUser);
}

export { getUserByEmail, addUser };