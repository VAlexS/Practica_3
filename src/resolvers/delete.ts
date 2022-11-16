import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection } from "../db/mongo.ts";

type DeleteUserContext = RouterContext<
    "/deleteUser/:id",
    {
        id: string;
    } & Record<string | number, string | undefined>,
    Record<string, any>
>;

export const deleteUser =async (context:DeleteUserContext) => {
    try{
        if (context.params?.id){
            const usuario_a_eliminar = await usersCollection.deleteOne({_id: new ObjectId(context.params.id),});
            
            usuario_a_eliminar? context.response.status = 200 : context.response.status = 404;
        }

    } catch (e){
        console.error(e);
        context.response.status = 500;
    }
    
}