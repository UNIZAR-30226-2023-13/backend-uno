import { Jugador } from "./../models/jugador";
import { Tablero } from "../models/tablero";
import { Persona } from "../models/persona";

const partidas: Tablero[] = [];
const partidaPorJugador: Map<string, Tablero> = new Map<string, Tablero>();

function obtenerTableroNoCompleto(): Tablero {
    // Busco una partida que no este completa
    const index: number = partidas.findIndex(
        (tablero: Tablero) => tablero.numeroJugadores() < 4 && !tablero.empezada
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
        console.log("Numero de partidas activas: " + partidas.length);
        return nuevoTablero;
    }
}

export function obtenerPartidaJugador(username: string): Tablero | null {
    return partidaPorJugador.get(username) || null;
}

// Si estan completos devuelve true, en caso contrario devuelve false
export function anadirJugadorPartida(persona: Persona): boolean {
    const partida: Tablero = obtenerTableroNoCompleto();
    const jugador: Jugador = {
        ...persona,
        mano: [],
    };
    partida.anadirJugador(jugador);
    partidaPorJugador.set(persona.username, partida);

    if (partida.numeroJugadores() === 4) {
        partida.comenzarPartida();
        return true;
    }
    return false;
}

export function eliminarJugadorPartida(username: string) {
    const partida: Tablero | undefined = partidaPorJugador.get(username);
    if (partida && username && username !== undefined) {
        const indexJugador: number = partida.jugadores.findIndex(
            (jugador: Jugador) => jugador.username === username
        );
        if (indexJugador !== -1) {
            const jugador: Jugador = partida.jugadores[indexJugador];
            partida.eliminarJugador(jugador);
        }
    }
    // Si no hay mas jugadores en la partida la eliminamos
    if (partida?.numeroJugadores() === 0) {
        const indexPartida = partidas.indexOf(partida);
        if (indexPartida > -1) {
            partidas.splice(indexPartida, 1);
        }
    }
    console.log("Numero de partidas activas: " + partidas.length);
}
