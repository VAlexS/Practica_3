import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getBooks, getUser } from "./resolvers/get.ts";
import { postAddAuthor, postAddBook, postAddUser } from "./resolvers/post.ts";
import { deleteUser } from "./resolvers/delete.ts";
import { putUpdateCart } from "./resolvers/put.ts";


const router = new Router();

router
    .get("/getBooks", getBooks)
    .get("/getUser/:id", getUser) //ok
    .post("/addUser", postAddUser) //ok
    .post("/addAuthor", postAddAuthor) //ok
    .post("/addBook", postAddBook) //ok
    .delete("/deleteUser/:id", deleteUser) //ok
    .put("/updateCart", putUpdateCart)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

const puerto = Number(Deno.env.get("PORT"));



await app.listen({port: puerto});

