import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection, booksCollection } from "../db/mongo.ts";

type PutCartContext = RouterContext<
    "/updateCart",
    Record<string | number, string | undefined>,
    Record<string, any>
>;


export const putUpdateCart =async (context:PutCartContext) => {
    try{
        const result = context.request.body({type: "json"});

        //console.log("si");

        const value = await result.value;

        //console.log("si");


        if (!value.id_book && !value.id_user){
            context.response.status = 400;
            return;
        }

        //primero busco el usuario
        const user = await usersCollection.findOne({_id: new ObjectId(value.id_user)});
        if (!user){
            context.response.status = 404;
            context.response.body = {mensaje: "Usuario no encontrado"};
            console.log("aqui")
            return;
        }

        //despues busco el libro y lo inserto en el array de books
        const book = await booksCollection.findOne({_id: new ObjectId(value.id_book)});
        if(!book){
            context.response.status = 404;
            context.response.body = {mensaje: "Libro no encontrado"};
            return;
        }

        //aqui esta el error
        const cart = user.cart;
        console.log(cart.length);
        cart.push(book._id.toString());

        const usuario_con_carro_act = await usersCollection.updateOne({_id: new ObjectId(value.id_user)}, {$set : {cart: cart}});
        context.response.body = usuario_con_carro_act;
        context.response.status = 200;

        
    } catch (e){
        console.error(e);
        context.response.status = 500;
    }
    
}