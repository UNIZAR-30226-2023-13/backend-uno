import { Persona } from "./../models/persona";
import bcrypt = require("bcryptjs");
import { Connection, QueryError, RowDataPacket } from "mysql2/promise";
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
            .catch((err: QueryError) => {
                console.log(err);
                // resolve(false)
                reject(err);
            });
    });
}

export async function obtenerCorreoPuntos(
    username: string
): Promise<{ persona: Persona; correo: string }> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query
        const queryString =
            "SELECT \
                u.email, u.puntos \
            FROM usuarios AS u \
            WHERE u.username = ?";

        db.query<RowDataPacket[]>(queryString, [username])
            .then(async ([rows]) => {
                if (rows.length > 0) {
                    const email: string = rows[0].email;
                    const puntos: number = rows[0].puntos;
                    resolve({
                        persona: {
                            username: username,
                            puntos: puntos,
                        },
                        correo: email,
                    });
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
