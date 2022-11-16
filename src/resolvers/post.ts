import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserSchema, BookSchema, AuthorSchema } from "../db/schemas.ts";
import { User, Book, Author } from "../types.ts";
import { usersCollection, booksCollection, authorsCollection } from "../db/mongo.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { uuid } from "https://deno.land/x/uuid/mod.ts";

type PostAddUserContext = RouterContext<
    "/addUser",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

type PostAddAuthorContext = RouterContext<
    "/addAuthor",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

type PostAddBookContext = RouterContext<
    "/addBook",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

export const postAddUser = async (context:PostAddUserContext) => {
    try{
        const result = context.request.body({type: "json"});
        const value : User = await result.value;

        if (!value?.name || !value?.email || !value?.password){
            context.response.status = 400;
            return;
        }

        const passwordHash = await bcrypt.hash(value?.password);

        const nuevoUsuario : Partial<User> = {
            name: value.name,
            password: passwordHash,
            email: value.email,
        }
        
        const emailRepetido = await usersCollection.findOne({email: value.email});
        if (emailRepetido){
            context.response.status = 400;
            context.response.body = {mensaje: "Esta direccion de correo electronico ya existe, ingrese otra"};
            return;
        }
        
        await usersCollection.insertOne(nuevoUsuario as UserSchema);
        context.response.body = {
            name: nuevoUsuario.name,
            password: nuevoUsuario.password,
            email: nuevoUsuario.email,
            createdAt: new Date(), //devuelve la fecha actual
            cart: [],
        }
        context.response.status = 200;
     

    } catch (e) {
        console.error(e);
        context.response.status = 500;
      }
    
}

export const postAddAuthor =async (context:PostAddAuthorContext) => {
    try{
        const result = context.request.body({type: "json"});
        const value : Author = await result.value;
        if(!value?.name){
            context.response.status = 400;
            return;
        }

        const nuevoAuthor: Partial<Author> = {
            name: value.name,
        };

        const count = await authorsCollection.find({name: nuevoAuthor.name}).toArray();
        if (count.length > 0){
            context.response.status = 406;
            context.response.body = {mensaje: "No puede haber autores duplicados"};
            return; 
        }
        await authorsCollection.insertOne(nuevoAuthor as AuthorSchema);
        const books = await booksCollection.find({}).toArray();
        nuevoAuthor.books = books;
        context.response.body = {
            name: nuevoAuthor.name,
            books: nuevoAuthor.books,
        }
        context.response.status = 200;

    } catch (e) {
        console.error(e);
        context.response.status = 500;
      }
}



export const postAddBook =async (context:PostAddBookContext) => {
    try{
        const result = context.request.body({type: "json"});
        const value : Book = await result.value;
        if(!value?.title || !value?.author || !value?.pages){
            context.response.status = 400;
            return;
        }

        const nuevoLibro: Partial<Book> = {
            title: value.title,
            author: value.author,
            pages: value.pages,
        };
     
        const existe_el_autor = await authorsCollection.findOne({name : nuevoLibro.author?.name});
        if (existe_el_autor){
            await booksCollection.insertOne(nuevoLibro as BookSchema);
            context.response.body = {
                title: nuevoLibro.title,
                author: nuevoLibro.author,
                pages: nuevoLibro.pages,
                ISBN: uuid(),
            }
            context.response.status = 200;
        }
        else {
            context.response.status = 404;
            context.response.body = {mensaje: "El autor que intentas incluir no existe"};   
        }
        

    } catch (e) {
        console.error(e);
        context.response.status = 500;
      }
    
}

