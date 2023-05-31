import { Connection, QueryError, RowDataPacket } from "mysql2/promise";
import bcrypt = require("bcryptjs");
import { obtenerDb } from "./db.service";

export async function cambiarEmailPassword(
    username: string,
    email: string,
    contrasena: string
): Promise<boolean> {
    const db: Connection = await obtenerDb();
    const contraseñaHasheada: string = await bcrypt.hash(contrasena, 10);
    return new Promise((resolve, reject) => {
        // Definir query
        const queryString =
            "UPDATE usuarios \
            SET password=?, email=? \
            WHERE username=?";

        db.query<RowDataPacket[]>(queryString, [
            contraseñaHasheada,
            email,
            username,
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
