import { Aspecto } from "../models/aspecto";
import { Connection, QueryError, RowDataPacket } from "mysql2/promise";
import { obtenerDb } from "./db.service";

export async function getAspectosCartas(username: string): Promise<Aspecto[]> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        const aspectos: Aspecto[] = [];
        // Obtener el aspecto en uso
        const queryStringUso =
            "SELECT u.aspecto_en_uso AS elegido \
                                    FROM usuarios AS u \
                                    WHERE u.username = ? \
                                    ";
        let aspecto_uso = "";
        db.query<RowDataPacket[]>(queryStringUso, username)
            .then(async ([rows]) => {
                aspecto_uso = rows[0].elegido;
            })
            .catch((err: QueryError) => {
                console.log(err);
                reject(err);
            });

        // Definir query
        const queryStringTotal =
            "SELECT a.nombre, a.ruta, a.puntos_desbloqueo, (u.puntos>=a.puntos_desbloqueo) AS desbloqueado \
                                    FROM aspectos AS a, usuarios AS u \
                                    WHERE u.username = ? \
                                    ";

        db.query<RowDataPacket[]>(queryStringTotal, username)
            .then(async ([rows]) => {
                const aspectos = rows.map((row: RowDataPacket) => ({
                    ...row,
                    desbloqueado: row.desbloqueado === 1 ? true : false,
                    enUso: row.nombre === aspecto_uso,
                })) as Aspecto[];
                resolve(aspectos);
            })
            .catch((err: QueryError) => {
                console.log(err);
                // resolve(false)
                reject(err);
            });

        return aspectos;
    });
}

export async function getAspectosCartasDesbloqueados(
    username: string
): Promise<Aspecto[]> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        const aspectos: Aspecto[] = [];
        // Definir query
        const queryString =
            "SELECT a.nombre, a.ruta, a.puntos_desbloqueo \
                                    FROM aspectos AS a, usuarios AS u \
                                    WHERE u.username = ? and u.puntos>=a.puntos_desbloqueo\
                                    ";

        db.query<RowDataPacket[]>(queryString, username)
            .then(async ([rows]) => {
                const aspectos = rows as Aspecto[];
                resolve(aspectos);
            })
            .catch((err: QueryError) => {
                console.log(err);
                // resolve(false)
                reject(err);
            });

        return aspectos;
    });
}

export async function cambiarAspectoCartas(
    username: string,
    nuevoTablero: string
): Promise<boolean> {
    const aspectosDesbloqueados: Aspecto[] =
        await getAspectosCartasDesbloqueados(username);
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
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
            db.query<RowDataPacket[]>(queryString, [nuevoTablero, username])
                .then(async () => {
                    resolve(true);
                })
                .catch((err: QueryError) => {
                    console.log(err);
                    // resolve(false)
                    reject(err);
                });
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
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        const aspectos: Aspecto[] = [];
        // Obtener el tablero en uso
        const queryStringUso =
            "SELECT u.tablero_en_uso AS elegido \
                                    FROM usuarios AS u \
                                    WHERE u.username = ? \
                                    ";

        let tablero_uso = "";
        db.query<RowDataPacket[]>(queryStringUso, username)
            .then(async ([rows]) => {
                tablero_uso = rows[0].elegido;
            })
            .catch((err: QueryError) => {
                console.log(err);
                // resolve(false)
                reject(err);
            });

        // Definir query
        const queryStringTotal =
            "SELECT t.nombre, t.ruta, t.puntos_desbloqueo, (u.puntos>=t.puntos_desbloqueo) AS desbloqueado \
                                    FROM tableros AS t, usuarios AS u \
                                    WHERE u.username = ? \
                                    ";

        db.query<RowDataPacket[]>(queryStringTotal, username)
            .then(async ([rows]) => {
                const aspectos = rows.map((row: RowDataPacket) => ({
                    ...row,
                    desbloqueado: row.desbloqueado === 1 ? true : false,
                    enUso: row.nombre === tablero_uso,
                })) as Aspecto[];
                resolve(aspectos);
            })
            .catch((err: QueryError) => {
                console.log(err);
                // resolve(false)
                reject(err);
            });

        return aspectos;
    });
}

export async function getAspectosTablerosDesbloqueados(
    username: string
): Promise<Aspecto[]> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        const aspectos: Aspecto[] = [];
        // Definir query
        const queryString =
            "SELECT t.nombre, t.ruta, t.puntos_desbloqueo \
                                    FROM tableros AS t, usuarios AS u \
                                    WHERE u.username = ? and u.puntos>=t.puntos_desbloqueo\
                                    ";

        db.query<RowDataPacket[]>(queryString, username)
            .then(async ([rows]) => {
                const aspectos = rows as Aspecto[];
                resolve(aspectos);
            })
            .catch((err: QueryError) => {
                console.log(err);
                // resolve(false)
                reject(err);
            });

        return aspectos;
    });
}

export async function cambiarTablero(
    username: string,
    nuevoTablero: string
): Promise<boolean> {
    const tablerosDesbloqueados: Aspecto[] =
        await getAspectosTablerosDesbloqueados(username);
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
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
            db.query<RowDataPacket[]>(queryString, [nuevoTablero, username])
                .then(async () => {
                    resolve(true);
                })
                .catch((err: QueryError) => {
                    console.log(err);
                    // resolve(false)
                    reject(err);
                });
        }
        // Si no lo tiene desbloqueado
        else {
            resolve(false);
        }
    });
}
