import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { User, Book, Author } from "../types.ts";

export type UserSchema = User & {_id: ObjectId};

export type BookSchema = Book & {_id: ObjectId};

export type AuthorSchema = Author & {_id: ObjectId};
