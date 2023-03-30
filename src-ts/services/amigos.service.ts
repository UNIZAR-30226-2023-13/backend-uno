import { Persona } from './../models/persona'
import {db} from "./db.service";
import { MysqlError } from "mysql";

export function getAmigos(username:String): Persona[]{
    // Definir query (algo parecido a esto)
    const queryString: string = `
        SELECT 
            u.username
            u.puntos,
        FROM Usuario AS u, Amigo a
        WHERE a.amigo1=? and a.amigo2=u.username
        UNION
        SELECT 
            u.username
            u.puntos,
        FROM Usuario AS u, Amigo a
        WHERE a.amigo2=? and a.amigo1=u.username
        `
        
    db.query(queryString, username, (err: MysqlError | null, result: any) => {
        if (err){
            console.log(err);
            return null;
        }
        else{
            const resultado=JSON.stringify(result);
            var amigos : Persona[] = JSON.parse(resultado);
            console.log("los amigos son " + amigos);
        }
    });
    
    return [];
}

