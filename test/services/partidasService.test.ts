import {
    anadirJugadorPartida,
    obtenerPartidaJugador,
} from "../../src-ts/services/partidas.service";
import { Tablero } from "../../src-ts/models/tablero";
import { Persona } from "../../src-ts/models/persona";

test("añadirJugador", () => {
    const persona: Persona = {
        username: "juan",
        puntos: 0,
    };
    anadirJugadorPartida(persona);
    const partida: Tablero =
        obtenerPartidaJugador(persona.username) || ({} as Tablero);
    expect(partida.jugadores).toContainEqual({
        ...persona,
        mano: [],
    });
});
