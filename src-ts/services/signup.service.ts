import { QueryError, createConnection, ConnectionOptions } from "mysql2";
import bcrypt = require("bcryptjs");
import dbConfig = require("../configs/db.config");

export async function crearCuenta(
    username: string,
    email: string,
    contrasena: string
): Promise<boolean> {
    const contraseñaHasheada: string = await bcrypt.hash(contrasena, 10);
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        // Definir query
        const queryString =
            "INSERT INTO usuarios (username, password, email, puntos, tablero_en_uso, aspecto_en_uso) \
                VALUES(?, ?, ?, 0, \
                (SELECT nombre FROM tableros LIMIT 1),\
                (SELECT nombre FROM aspectos LIMIT 1))";

        db.query(
            queryString,
            [username, contraseñaHasheada, email],
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
