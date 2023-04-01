import { Persona } from './../models/persona'
import {db} from "./db.service";
import { QueryError,createConnection,RowDataPacket } from 'mysql2';
const dbConfig = require('../configs/db.config');


export function getAmigos(username:String): Promise<Persona[]>{
    
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        let amigos : Persona[] = [];
        // Definir query 
        const queryString: string = 'SELECT \
                                        u.username, u.puntos \
                                    FROM usuarios AS u, amigos AS a \
                                    WHERE a.username = ? and a.amigo=u.username \
                                    UNION   \
                                    SELECT \
                                        u.username, u.puntos \
                                    FROM usuarios AS u, amigos AS a\
                                    WHERE a.amigo = ? and a.username=u.username'
        
        db.query(queryString, [username, username], (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                const resultado=JSON.stringify(rows);
                const amigos = JSON.parse(resultado);
                console.log("estoy deberia ir antes")
                console.log(resultado)
                resolve(amigos)
            }
            
        });

        return amigos;
    })
}

export function anadirAmigos(username1:String, username2:String): Boolean{
    // Definir query (algo parecido a esto)
    const db  = createConnection(dbConfig);
    const queryString: string = `
        INSERT INTO amigos(username,amigo) 
        VALUES (?,?)
        `
        
    db.query(queryString, [username1, username2], (err: QueryError | null, result: any) => {
        if (err){
            return false;
        }
        else{
            return true;
        }
        
    });
    
    return false;
}
