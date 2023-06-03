import { Connection, RowDataPacket, QueryError } from "mysql2/promise";
import bcrypt = require("bcryptjs");
import { obtenerDb } from "./db.service";
import { Tablero } from "../models/tablero";

export async function añadirPartida(partida: Tablero): Promise<void> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query
        const queryString =
            "INSERT INTO usuarios (username, password, email, puntos, tablero_en_uso, aspecto_en_uso) \
                VALUES(?, ?, ?, 0, \
                (SELECT nombre FROM tableros WHERE puntos_desbloqueo=0 LIMIT 1),\
                (SELECT nombre FROM aspectos WHERE puntos_desbloqueo=0 LIMIT 1))";

        db.query<RowDataPacket[]>(queryString, [])
            .then(async () => {
                resolve();
            })
            .catch((err: QueryError) => {
                console.log(err);
                resolve();
                reject(err);
            });
    });
}
