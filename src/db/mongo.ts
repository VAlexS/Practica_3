import {MongoClient, Database} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { AuthorSchema, BookSchema, UserSchema } from "./schemas.ts";

await config({export: true, allowEmptyValues: true});

const connectMongoDB = async(): Promise<Database> => {
    /*const mongo_usr = Deno.env.get("MONGO_USR");
    const mongo_pwd = Deno.env.get("MONGO_PWD");*/
    const db_name = Deno.env.get("DB_NAME");
    const mongo_uri = Deno.env.get("MONGO_URI");
    //const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@${mongo_uri}/${db_name}?authMechanism=SCRAM-SHA-1`;
    const mongo_url = `${mongo_uri}/${db_name}?authMechanism=SCRAM-SHA-1`;

    const client = new MongoClient();
    await client.connect(mongo_url);
    const db = client.database(db_name);
    return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const usersCollection = db.collection<UserSchema>("users");

export const booksCollection = db.collection<BookSchema>("books");

export const authorsCollection = db.collection<AuthorSchema>("authors");

