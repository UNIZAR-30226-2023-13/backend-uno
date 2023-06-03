import { Partida } from "./../models/partida";
import { Connection, RowDataPacket, QueryError } from "mysql2/promise";
import { obtenerDb } from "./db.service";
import { Tablero } from "../models/tablero";

export async function anadirPartida(partida: Tablero): Promise<void> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        // Definir query para añadir una partida y su fecha
        const queryStringPartida =
            "INSERT INTO partida_finalizada \
            (id,fecha) \
            VALUES(NULL,?)";

        const queryStringGetIDPartida = "SELECT LAST_INSERT_ID() as id";

        // Definir query para añadir los jugadores a la tabla Jugado
        const queryStringJugadores =
            "INSERT INTO jugado \
            (username, id_partida, es_ganador) \
            VALUES(?, ?, ?)\
            ";

        let idPartida = -1;
        // Añadimos la partida
        db.query<RowDataPacket[]>(queryStringPartida, [partida.fecha])
            .then(async () => {
                // Añadimos la partida
                db.query<RowDataPacket[]>(queryStringGetIDPartida, [])
                    .then(async ([rows]) => {
                        idPartida = rows[0].id;
                        console.log(idPartida);
                        for (const jugador of partida.jugadores) {
                            console.log(idPartida);
                            // Añadimos los jugadores de la partida
                            db.query<RowDataPacket[]>(queryStringJugadores, [
                                jugador.username,
                                idPartida,
                                partida.ganador === jugador,
                            ]).catch((err: QueryError) => {
                                console.log(
                                    "Se ha intentado añadir una partida con un jugador que no existe: " +
                                        jugador.username
                                );
                                resolve();
                                reject(err);
                            });
                        }
                    })
                    .catch((err: QueryError) => {
                        console.log(err);
                        resolve();
                        reject(err);
                    });
            })
            .catch((err: QueryError) => {
                console.log(err);
                resolve();
                reject(err);
            });
    });
}

export async function obtenerPartidasJugador(
    username: string
): Promise<Partida[]> {
    const db: Connection = await obtenerDb();
    return new Promise((resolve, reject) => {
        const queryStringIDsPartida =
            "SELECT id_partida as id \
        FROM jugado j \
        WHERE j.username = ? \
        ";

        const queryStringPartidas =
            "SELECT username, es_ganador, fecha \
        FROM \
        jugado j INNER JOIN partida_finalizada pf ON j.id_partida  = pf.id \
        WHERE pf.id=? \
        ";

        db.query<RowDataPacket[]>(queryStringIDsPartida, username)
            .then(async ([rows]) => {
                const idsPartidas: number[] = rows.map((row) => row.id);
                const partidasPromises = idsPartidas.map(async (id) => {
                    const [partidaRows] = await db.query<RowDataPacket[]>(
                        queryStringPartidas,
                        id
                    );

                    const jugadores: { nombre: string; esGanador: boolean }[] =
                        [];
                    let fecha: Date = new Date();
                    for (const row of partidaRows) {
                        jugadores.push({
                            nombre: row.username,
                            esGanador: row.es_ganador === 1,
                        });
                        fecha = row.fecha;
                    }
                    return { fecha, jugadores };
                });
                return Promise.all(partidasPromises);
            })
            .then((partidas) => {
                resolve(partidas);
            })
            .catch((err: QueryError) => {
                reject(err);
            });
    });
}
