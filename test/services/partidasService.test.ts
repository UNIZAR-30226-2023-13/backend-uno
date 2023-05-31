import {
    anadirJugadorPartida,
    obtenerPartidaJugador,
    obtenerPartidaJugadorRapido,
} from "../../src-ts/services/partidas.service";

test("añadirJugador", () => {
    anadirJugadorPartida("juan");
    expect(obtenerPartidaJugadorRapido("juan")).toEqual(
        obtenerPartidaJugador("juan")
    );

    obtenerPartidaJugadorRapido("juan")?.mezclarBarajaCentral();
    expect(obtenerPartidaJugadorRapido("juan")).toEqual(
        obtenerPartidaJugador("juan")
    );
    console.log(obtenerPartidaJugadorRapido("juan"));
});
