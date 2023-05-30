import {
    QueryError,
    createConnection,
    RowDataPacket,
    ConnectionOptions,
} from "mysql2";
import bcrypt = require("bcryptjs");
import dbConfig = require("../configs/db.config");

export async function comprobarContrasena(
    username: string,
    contrasena: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const db = createConnection(dbConfig as ConnectionOptions);
        // Definir query
        const queryString =
            "SELECT \
                                        u.password \
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
                        const contraseñaHasheada: string = rows[0].password;
                        const iguales: boolean = await bcrypt.compare(
                            contrasena,
                            contraseñaHasheada
                        );
                        resolve(iguales);
                    } else {
                        resolve(false);
                    }
                }
            }
        );
    });
}
