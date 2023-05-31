import {
    QueryError,
    createConnection,
    RowDataPacket,
    ConnectionOptions,
} from "mysql2";
import bcrypt = require("bcryptjs");
import dbConfig = require("../configs/db.config");
import { Connection } from "mysql2/promise";
import { obtenerDb } from "./db.service";

export async function comprobarContrasena(
    username: string,
    contrasena: string
): Promise<boolean> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query
        const queryString =
            "SELECT \
                u.password \
            FROM usuarios AS u \
            WHERE u.username = ?";

        db.query<RowDataPacket[]>(queryString, [username])
            .then(async ([rows]) => {
                if (rows.length > 0) {
                    const contraseñaHasheada: string = rows[0].password;
                    const iguales: boolean = await bcrypt.compare(
                        contrasena,
                        contraseñaHasheada
                    );
                    resolve(iguales);
                } else {
                    resolve(false);
                }
            })
            .catch((err) => {
                console.log(err);
                // resolve(false)
                reject(err);
            });
    });
}

export async function obtenerCorreo(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        // Definir query
        const queryString =
            "SELECT \
                u.email \
            FROM usuarios AS u \
            WHERE u.username = ?";

        db.query(
            queryString,
            [username],
            async (err: QueryError | null, rows: RowDataPacket[]) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if (rows.length > 0) {
                        const email: string = rows[0].email;
                        resolve(email);
                    } else {
                        reject(err);
                    }
                }
            }
        );
    });
}
