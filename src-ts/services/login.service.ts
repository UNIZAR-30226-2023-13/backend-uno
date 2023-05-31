import { QueryError, RowDataPacket } from "mysql2";
import bcrypt = require("bcryptjs");
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
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query
        const queryString =
            "SELECT \
                u.email \
            FROM usuarios AS u \
            WHERE u.username = ?";

        db.query<RowDataPacket[]>(queryString, [username])
            .then(async ([rows]) => {
                if (rows.length > 0) {
                    const email: string = rows[0].email;
                    resolve(email);
                } else {
                    reject();
                }
            })
            .catch((err: QueryError) => {
                console.log(err);
                // resolve(false)
                reject(err);
            });
    });
}
