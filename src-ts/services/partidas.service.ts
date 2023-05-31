import { Tablero } from "../models/tablero";
import { Jugador } from "../models/jugador";

const partidas: Tablero[] = [];

const partidaPorJugador: Map<string, Tablero> = new Map<string, Tablero>();

function obtenerTableroNoCompleto(): Tablero {
    // Busco una partida que no este completa
    const index: number = partidas.findIndex(
        (tablero: Tablero) => tablero.numeroJugadores() < 4
    );
    // Si existe
    if (index !== -1) {
        return partidas[index];
    }
    // Si no existe, debo crear una nueva
    else {
        console.log("Creo una nueva partida");
        const nuevoTablero: Tablero = new Tablero();
        partidas.unshift(nuevoTablero);
        return nuevoTablero;
    }
}

export function obtenerPartidaJugador(username: string): Tablero | null {
    const indexPartida: number = partidas.findIndex((tablero) =>
        tablero.jugadores.some((jugador) => {
            return jugador.username === username;
        })
    );
    if (indexPartida != -1) {
        return partidas[indexPartida];
    } else return null;
}

export function obtenerPartidaJugadorRapido(username: string): Tablero | null {
    return partidaPorJugador.get(username) || null;
}

export function anadirJugadorPartida(username: string) {
    const partida: Tablero = obtenerTableroNoCompleto();
    const jugador: Jugador = {
        username: username,
        puntos: 0,
        mano: [],
    };
    partida.anadirJugador(jugador);
    partidaPorJugador.set(username, partida);
}
