import { Aspecto } from '../models/aspecto';
import {db} from "./db.service";
import { QueryError,createConnection,RowDataPacket } from 'mysql2';
const dbConfig = require('../configs/db.config');


export async function getTodosAspectosCartas(): Promise<Aspecto[]>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        let aspectos : Aspecto[] = [];
        // Definir query 
        const queryString: string = 'SELECT * \
                                    FROM aspectos'
        
        db.query(queryString, (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                const aspectos = rows as Aspecto[]
                resolve(aspectos)
            }
            
        });

        return aspectos;
    })
}

export async function getAspectosCartasDesbloqueados(username: String): Promise<Aspecto[]>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        let aspectos : Aspecto[] = [];
        // Definir query 
        const queryString: string = 'SELECT a.nombre, a.ruta, a.puntos_desbloqueo \
                                    FROM aspectos AS a, usuarios AS u \
                                    WHERE u.username = ? and u.puntos>=a.puntos_desbloqueo\
                                    '
        
        db.query(queryString, username, (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                const aspectos = rows as Aspecto[]
                resolve(aspectos)
            }
            
        });

        return aspectos;
    })
}

export async function getTodosAspectosTableros(): Promise<Aspecto[]>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        let aspectos : Aspecto[] = [];
        // Definir query 
        const queryString: string = 'SELECT * \
                                    FROM tableros'
        
        db.query(queryString, (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                const aspectos = rows as Aspecto[]
                resolve(aspectos)
            }
            
        });

        return aspectos;
    })
}

export async function getAspectosTablerosDesbloqueados(username: String): Promise<Aspecto[]>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        let aspectos : Aspecto[] = [];
        // Definir query 
        const queryString: string = 'SELECT t.nombre, t.ruta, t.puntos_desbloqueo \
                                    FROM tableros AS t, usuarios AS u \
                                    WHERE u.username = ? and u.puntos>=t.puntos_desbloqueo\
                                    '
        
        db.query(queryString, username, (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                const aspectos = rows as Aspecto[]
                resolve(aspectos)
            }
            
        });

        return aspectos;
    })
}
