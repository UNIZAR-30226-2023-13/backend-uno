import { QueryError, createConnection, ConnectionOptions } from "mysql2";
import bcrypt = require("bcryptjs");
import dbConfig = require("../configs/db.config");

export async function cambiarEmailPassword(
    username: string,
    email: string,
    contrasena: string
): Promise<boolean> {
    const contraseñaHasheada: string = await bcrypt.hash(contrasena, 10);
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        // Definir query
        const queryString =
            "UPDATE usuarios \
            SET password=?, email=? \
            WHERE username=?";

        db.query(
            queryString,
            [contraseñaHasheada, email, username],
            async (err: QueryError | null) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                    reject(err);
                } else {
                    resolve(true);
                }
            }
        );
    });
}
