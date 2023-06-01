import { Connection, QueryError, RowDataPacket } from "mysql2/promise";
import bcrypt = require("bcryptjs");
import { obtenerDb } from "./db.service";
import { comprobarContrasena } from "./login.service";

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

export async function eliminarCuenta(
    username: string,
    contrasena: string
): Promise<boolean> {
    const db: Connection = await obtenerDb();
    const contrasenaCorrecta: boolean = await comprobarContrasena(
        username,
        contrasena
    );
    return new Promise((resolve, reject) => {
        if (!contrasenaCorrecta) {
            resolve(false);
        }
        // Definir query
        const queryString =
            "DELETE \
            FROM usuarios \
            WHERE username=?";

        db.query<RowDataPacket[]>(queryString, [username])
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
