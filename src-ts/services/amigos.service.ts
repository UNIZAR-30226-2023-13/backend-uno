import { Persona } from "./../models/persona";
import { QueryError, RowDataPacket, Connection } from "mysql2/promise";
import { obtenerDb } from "./db.service";

export async function getAmigos(username: string): Promise<Persona[]> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        const amigos: Persona[] = [];
        // Definir query
        const queryString =
            "SELECT \
                                        u.username, u.puntos \
                                    FROM usuarios AS u, amigos AS a \
                                    WHERE a.username = ? and a.amigo=u.username \
                                    UNION   \
                                    SELECT \
                                        u.username, u.puntos \
                                    FROM usuarios AS u, amigos AS a\
                                    WHERE a.amigo = ? and a.username=u.username";

        db.query<RowDataPacket[]>(queryString, [username, username])
            .then(async ([rows]) => {
                const amigos = rows as Persona[];
                resolve(amigos);
            })
            .catch((err: QueryError) => {
                console.log(err);
                // resolve(false)
                reject(err);
            });
        return amigos;
    });
}

export async function getInvitaciones(username: string): Promise<Persona[]> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        const amigos: Persona[] = [];
        // Definir query
        const queryString =
            "SELECT \
                                        u.username, u.puntos \
                                    FROM usuarios AS u, solicitudes_amistad AS s \
                                    WHERE s.amigo = ? and s.username=u.username \
                                    ";

        db.query<RowDataPacket[]>(queryString, [username])
            .then(async ([rows]) => {
                const solicitudes = rows as Persona[];
                resolve(solicitudes);
            })
            .catch((err: QueryError) => {
                console.log(err);
                reject(err);
            });

        return amigos;
    });
}

export async function enviarInvitacion(
    username1: string,
    username2: string
): Promise<boolean> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query para comprobar si eran amigos
        const queryString =
            "INSERT INTO solicitudes_amistad(username,amigo) \
                                    VALUES (?,?) \
                                    ";
        db.query<RowDataPacket[]>(queryString, [username1, username2])
            .then(async () => {
                resolve(true);
            })
            .catch((err: QueryError) => {
                console.log(err);
                resolve(false);
                reject(err);
            });
    });
}

export async function comprobarSiAmigos(
    username1: string,
    username2: string
): Promise<boolean> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query para comprobar si eran amigos
        const queryString =
            "SELECT \
                                        1 \
                                    FROM amigos AS a \
                                    WHERE (a.username = ? and a.amigo=?) \
                                            or (a.amigo=? and a.username = ?)\
                                    ";
        db.query<RowDataPacket[]>(queryString, [
            username1,
            username2,
            username1,
            username2,
        ])
            .then(async ([rows]) => {
                if (rows.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((err: QueryError) => {
                console.log(err);
                resolve(false);
                reject(err);
            });
    });
}

export async function anadirAmigos(
    username1: string,
    username2: string
): Promise<boolean> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query para comprobar si eran amigos
        const queryString =
            "INSERT INTO amigos(username,amigo) \
                                    VALUES (?,?) \
                                    ";
        db.query<RowDataPacket[]>(queryString, [username1, username2])
            .then(async () => {
                resolve(true);
            })
            .catch((err: QueryError) => {
                console.log(err);
                resolve(false);
                reject(err);
            });
    });
}

export async function eliminarAmigos(
    username1: string,
    username2: string
): Promise<boolean> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query para comprobar si eran amigos
        const queryString =
            "DELETE FROM amigos \
            WHERE (username=? AND amigo=?) \
                OR (username=? AND amigo=?)";

        db.query<RowDataPacket[]>(queryString, [
            username1,
            username2,
            username2,
            username1,
        ])
            .then(async () => {
                resolve(true);
            })
            .catch((err: QueryError) => {
                console.log(err);
                resolve(false);
                reject(err);
            });
    });
}

export async function eliminarInvitacion(
    username1: string,
    username2: string
): Promise<boolean> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query para comprobar si eran amigos
        const queryString =
            "DELETE FROM solicitudes_amistad \
            WHERE username = ? AND \
            amigo = ?";
        db.query<RowDataPacket[]>(queryString, [username1, username2])
            .then(async () => {
                resolve(true);
            })
            .catch((err: QueryError) => {
                console.log(err);
                resolve(false);
                reject(err);
            });
    });
}
