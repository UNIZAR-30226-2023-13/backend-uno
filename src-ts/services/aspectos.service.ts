import { Aspecto } from "../models/aspecto";
//import { db } from "./db.service";
import {
    QueryError,
    createConnection,
    RowDataPacket,
    ConnectionOptions,
} from "mysql2";
import dbConfig = require("../configs/db.config");

export async function getAspectosCartas(username: string): Promise<Aspecto[]> {
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        const aspectos: Aspecto[] = [];
        // Definir query
        const queryString =
            "SELECT a.nombre, a.ruta, a.puntos_desbloqueo, (u.puntos>=a.puntos_desbloqueo) AS desbloqueado \
                                    FROM aspectos AS a, usuarios AS u \
                                    WHERE u.username = ? \
                                    ";

        db.query(
            queryString,
            username,
            (err: QueryError | null, rows: RowDataPacket[]) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    const aspectos = rows.map((row: RowDataPacket) => ({
                        ...row,
                        desbloqueado: row.desbloqueado === 1 ? true : false,
                    })) as Aspecto[];
                    resolve(aspectos);
                }
            }
        );

        return aspectos;
    });
}

export async function getAspectosCartasDesbloqueados(
    username: string
): Promise<Aspecto[]> {
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        const aspectos: Aspecto[] = [];
        // Definir query
        const queryString =
            "SELECT a.nombre, a.ruta, a.puntos_desbloqueo \
                                    FROM aspectos AS a, usuarios AS u \
                                    WHERE u.username = ? and u.puntos>=a.puntos_desbloqueo\
                                    ";

        db.query(
            queryString,
            username,
            (err: QueryError | null, rows: RowDataPacket[]) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    const aspectos = rows as Aspecto[];
                    resolve(aspectos);
                }
            }
        );

        return aspectos;
    });
}

export async function cambiarAspectoCartas(
    username: string,
    nuevoTablero: string
): Promise<boolean> {
    const aspectosDesbloqueados: Aspecto[] =
        await getAspectosCartasDesbloqueados(username);
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        // Definir query
        const queryString =
            "UPDATE usuarios \
                                    SET aspecto_en_uso=? \
                                    WHERE username = ? \
                                    ";
        // Comprobar que es parte de los tableros desbloqueados
        const numTableros = aspectosDesbloqueados.filter(
            (t) => t.nombre === nuevoTablero
        ).length;
        // Si lo tiene desbloqueado
        if (numTableros > 0) {
            db.query(
                queryString,
                [nuevoTablero, username],
                (err: QueryError | null, rows: RowDataPacket[]) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                }
            );
        }
        // Si no lo tiene desbloqueado
        else {
            resolve(false);
        }
    });
}

export async function getAspectosTableros(
    username: string
): Promise<Aspecto[]> {
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        const aspectos: Aspecto[] = [];
        // Obtener el tablero en uso
        const queryStringUso =
            "SELECT u.tablero_en_uso AS elegido \
                                    FROM usuarios AS u \
                                    WHERE u.username = ? \
                                    ";

        let tablero_uso = "";
        db.query(
            queryStringUso,
            username,
            (err: QueryError | null, rows: RowDataPacket[]) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    tablero_uso = rows[0].elegido;
                }
            }
        );

        // Definir query
        const queryStringTotal =
            "SELECT t.nombre, t.ruta, t.puntos_desbloqueo, (u.puntos>=t.puntos_desbloqueo) AS desbloqueado \
                                    FROM tableros AS t, usuarios AS u \
                                    WHERE u.username = ? \
                                    ";

        db.query(
            queryStringTotal,
            username,
            (err: QueryError | null, rows: RowDataPacket[]) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    const aspectos = rows.map((row: RowDataPacket) => ({
                        ...row,
                        desbloqueado: row.desbloqueado === 1 ? true : false,
                        enUso: row.nombre === tablero_uso,
                    })) as Aspecto[];
                    resolve(aspectos);
                }
            }
        );

        return aspectos;
    });
}

export async function getAspectosTablerosDesbloqueados(
    username: string
): Promise<Aspecto[]> {
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        const aspectos: Aspecto[] = [];
        // Definir query
        const queryString =
            "SELECT t.nombre, t.ruta, t.puntos_desbloqueo \
                                    FROM tableros AS t, usuarios AS u \
                                    WHERE u.username = ? and u.puntos>=t.puntos_desbloqueo\
                                    ";

        db.query(
            queryString,
            username,
            (err: QueryError | null, rows: RowDataPacket[]) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    const aspectos = rows as Aspecto[];
                    resolve(aspectos);
                }
            }
        );

        return aspectos;
    });
}

export async function cambiarTablero(
    username: string,
    nuevoTablero: string
): Promise<boolean> {
    const tablerosDesbloqueados: Aspecto[] =
        await getAspectosTablerosDesbloqueados(username);
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        // Definir query
        const queryString =
            "UPDATE usuarios \
                                    SET tablero_en_uso=? \
                                    WHERE username = ? \
                                    ";
        // Comprobar que es parte de los tableros desbloqueados
        const numTableros = tablerosDesbloqueados.filter(
            (t) => t.nombre === nuevoTablero
        ).length;
        // Si lo tiene desbloqueado
        if (numTableros > 0) {
            db.query(
                queryString,
                [nuevoTablero, username],
                (err: QueryError | null) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                }
            );
        }
        // Si no lo tiene desbloqueado
        else {
            resolve(false);
        }
    });
}
