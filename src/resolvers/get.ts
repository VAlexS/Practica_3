import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { booksCollection, usersCollection } from "../db/mongo.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

//recibe los parametros por url, page (la pagina que queremos, por defecto es 0, el campo es oblihatorio) y title (campo opcional indicando el titulo)
type GetBooksContext = RouterContext<
    "/getBooks",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

//el id de mongo
type GetUserContext = RouterContext<
  "/getUser/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getBooks = async (context:GetBooksContext) => {
    try{
   

      const params = getQuery(context, { mergeParams: true });

      if(!params.page){
        context.response.status = 400;
        context.response.body = {mensaje: "Ruta invalida"};
        return;
      }

      const books = await booksCollection.find({
        title: { $eq: params?.title },
      })
        .limit(10)
        .skip(Number(params.page) * 10)
        .toArray();
      if (books.length > 0) {
        context.response.status = 200;
        context.response.body = books;
      } else {
        context.response.status = 404;
        context.response.body = {mensaje: "Books not found"};
    
  }
    } catch (e) {
      console.error(e);
      context.response.status = 500;
    }
    
}

export const getUser =async (context:GetUserContext) => {
  try{
    if (context.params?.id){
      const usuario = await usersCollection.findOne({_id: new ObjectId(context.params.id)});

      if(usuario){
        context.response.body = usuario;
        context.response.status = 200;
      }
      else {
        context.response.status = 404;
        context.response.body = {mensaje: "Usuario no encontrado"};
      }
    }
  } catch(e){
    console.error(e);
    context.response.status = 500;
  }
  
}



