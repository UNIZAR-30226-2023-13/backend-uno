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
                const amigos = rows as Persona[]
                resolve(amigos)
            }
            
        });

        return amigos;
    })
}

export function getInvitaciones(username:String): Promise<Persona[]>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        let amigos : Persona[] = [];
        // Definir query 
        const queryString: string = 'SELECT \
                                        u.username, u.puntos \
                                    FROM usuarios AS u, solicitudes_amistad AS s \
                                    WHERE s.amigo = ? and s.username=u.username \
                                    '
        
        db.query(queryString, [username, username], (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                const solicitudes = rows as Persona[]
                resolve(solicitudes)
            }
            
        });

        return amigos;
    })
}

export function enviarInvitacion(username1:String, username2:String): Promise<Boolean>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);

        // Definir query para comprobar si eran amigos 
        const queryString: string = 'INSERT INTO solicitudes_amistad(username,amigo) \
                                    VALUES (?,?) \
                                    '
        db.query(queryString, [username1, username2], (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                resolve(false);
                reject(err);
            }
            else{
                resolve(true)
            }

        });
    })
}


export function comprobarSiAmigos(username1:String, username2:String): Promise<Boolean>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);

        // Definir query para comprobar si eran amigos 
        const queryString: string = 'SELECT \
                                        1 \
                                    FROM amigos AS a \
                                    WHERE (a.username = ? and a.amigo=?) \
                                            or (a.amigo=? and a.username = ?)\
                                    '
        db.query(queryString, [username1, username2, username1, username2], (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                if(rows.length>0){
                    resolve(true)
                }
                else{
                    resolve(false)
                }
            }
            
        });
    })
}

export function anadirAmigos(username1:String, username2:String): Promise<Boolean>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);

        // Definir query para comprobar si eran amigos 
        const queryString: string = 'INSERT INTO amigos(username,amigo) \
                                    VALUES (?,?) \
                                    '
        db.query(queryString, [username1, username2], (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                resolve(false);
                reject(err);
            }
            else{
                resolve(true)
            }

        });
    })
}
