import { Aspecto } from '../models/aspecto';
import {db} from "./db.service";
import { QueryError,createConnection,RowDataPacket } from 'mysql2';
const dbConfig = require('../configs/db.config');


export async function getAspectosCartas(username: String): Promise<Aspecto[]>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        let aspectos : Aspecto[] = [];
        // Definir query 
        const queryString: string = 'SELECT a.nombre, a.ruta, a.puntos_desbloqueo, (u.puntos>=a.puntos_desbloqueo) AS desbloqueado \
                                    FROM aspectos AS a, usuarios AS u \
                                    WHERE u.username = ? \
                                    '
        
        db.query(queryString, username, (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                const aspectos = rows.map((row: RowDataPacket) => ({
                    ...row,
                    desbloqueado: (row.desbloqueado === 1 ? true : false),
                })) as Aspecto[]; 
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

export async function cambiarAspectoCartas(username: String, nuevoTablero: String): Promise<Boolean> {
    const aspectosDesbloqueados: Aspecto[] = await getAspectosCartasDesbloqueados(username);
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        // Definir query 
        const queryString: string = 'UPDATE usuarios \
                                    SET aspecto_en_uso=? \
                                    WHERE username = ? \
                                    '
        // Comprobar que es parte de los tableros desbloqueados
        const numTableros = aspectosDesbloqueados.filter((t)=> t.nombre===nuevoTablero).length
        // Si lo tiene desbloqueado
        if(numTableros>0){
            db.query(queryString, [nuevoTablero, username], (err: QueryError | null, rows: RowDataPacket[]) => {
                if (err){
                    console.log(err);
                    reject(err);
                }
                else{
                    
                    resolve(true)
                }
                
            });
        }
        // Si no lo tiene desbloqueado
        else{
            resolve(false)
        }
    })
}

export async function getAspectosTableros(username: String): Promise<Aspecto[]>{
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        let aspectos : Aspecto[] = [];
        // Obtener el tablero en uso
        const queryStringUso: string = 'SELECT u.tablero_en_uso AS elegido \
                                    FROM usuarios AS u \
                                    WHERE u.username = ? \
                                    '

        let tablero_uso: String = ""
        db.query(queryStringUso, username, (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                tablero_uso = rows[0].elegido;
            }
        });
    
        // Definir query 
        const queryStringTotal: string = 'SELECT t.nombre, t.ruta, t.puntos_desbloqueo, (u.puntos>=t.puntos_desbloqueo) AS desbloqueado \
                                    FROM tableros AS t, usuarios AS u \
                                    WHERE u.username = ? \
                                    '
        
        db.query(queryStringTotal, username, (err: QueryError | null, rows: RowDataPacket[]) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else{
                const aspectos = rows.map((row: RowDataPacket) => ({
                    ...row,
                    desbloqueado: (row.desbloqueado === 1 ? true : false),
                    enUso : (row.nombre === tablero_uso)
                })) as Aspecto[]; 
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

export async function cambiarTablero(username: String, nuevoTablero: String): Promise<Boolean> {
    const tablerosDesbloqueados: Aspecto[] = await getAspectosTablerosDesbloqueados(username);
    return new Promise((resolve, reject) =>{
        const db  = createConnection(dbConfig);
        // Definir query 
        const queryString: string = 'UPDATE usuarios \
                                    SET tablero_en_uso=? \
                                    WHERE username = ? \
                                    '
        // Comprobar que es parte de los tableros desbloqueados
        const numTableros = tablerosDesbloqueados.filter((t)=> t.nombre===nuevoTablero).length
        // Si lo tiene desbloqueado
        if(numTableros>0){
            db.query(queryString, [nuevoTablero, username], (err: QueryError | null, rows: RowDataPacket[]) => {
                if (err){
                    console.log(err);
                    reject(err);
                }
                else{
                    
                    resolve(true)
                }
                
            });
        }
        // Si no lo tiene desbloqueado
        else{
            resolve(false)
        }
    })
}
