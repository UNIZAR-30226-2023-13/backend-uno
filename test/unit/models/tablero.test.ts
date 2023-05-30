import { Tablero } from "./../../../src-ts/models/tablero";
import { Jugador } from "./../../../src-ts/models/jugador";
import { Carta } from "./../../../src-ts/models/carta";

test("crearTableroVacio", () => {
    const numCartas = 108;
    const tableroVacio: Tablero = new Tablero();
    expect(tableroVacio.mazoCentral.length).toEqual(numCartas);
});

test("mezclarMazoCentral", () => {
    const tableroSinMezclar: Tablero = new Tablero();
    const tableroMezclado = new Tablero();
    tableroMezclado.mezclarBarajaCentral();
    expect(tableroSinMezclar).not.toEqual(tableroMezclado);
});

test("repartirCartas", () => {
    const tablero: Tablero = new Tablero();
    const jugador1: Jugador = {
        username: "jugador1",
        puntos: 0,
        mano: [],
    };
    const jugador2: Jugador = {
        username: "jugador2",
        puntos: 0,
        mano: [],
    };
    tablero.anadirJugador(jugador1);
    tablero.anadirJugador(jugador2);

    tablero.repartirCartasIniciales();
    expect(jugador1.mano).toHaveLength(7);
    expect(jugador2.mano).toHaveLength(7);
});

test("anadirUnSoloJugador", () => {
    const jugador: Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [],
    };
    const tableroVacio: Tablero = new Tablero([], [], [], true);
    const tableroConJugador: Tablero = new Tablero([], [], [jugador], true);
    tableroVacio.anadirJugador(jugador);
    expect(tableroVacio).toEqual(tableroConJugador);
});

test("anadirDosJugadores", () => {
    const jugador1: Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [],
    };
    const jugador2: Jugador = {
        username: "ismael",
        puntos: 0,
        mano: [],
    };
    const tableroVacio: Tablero = new Tablero([], [], [], true);
    const tableroConJugadores: Tablero = new Tablero(
        [],
        [],
        [jugador1, jugador2],
        true
    );
    tableroVacio.anadirJugador(jugador1);
    tableroVacio.anadirJugador(jugador2);
    expect(tableroVacio).toEqual(tableroConJugadores);
});

test("eliminarUnSoloJugador", () => {
    const carta: Carta = {
        color: "rojo",
        numero: 1,
    };
    const jugador: Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [carta],
    };
    const tableroSinJugador: Tablero = new Tablero([carta], [], [], true);
    const tableroConJugador: Tablero = new Tablero([], [], [jugador], true);
    tableroConJugador.eliminarJugador(jugador);
    expect(tableroConJugador).toEqual(tableroSinJugador);
});

test("eliminarDosJugadores", () => {
    const jugador1: Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [],
    };
    const jugador2: Jugador = {
        username: "ismael",
        puntos: 0,
        mano: [],
    };
    const tableroVacio: Tablero = new Tablero([], [], [], true);
    const tableroConJugadores: Tablero = new Tablero(
        [],
        [],
        [jugador1, jugador2],
        true
    );
    tableroConJugadores.eliminarJugador(jugador1);
    tableroConJugadores.eliminarJugador(jugador2);
    expect(tableroConJugadores).toEqual(tableroVacio);
});

test("eliminarJugadorNoExiste", () => {
    const jugador: Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [],
    };
    const tableroVacio: Tablero = new Tablero([], [], [], true);
    expect(tableroVacio.eliminarJugador(jugador)).toEqual(false);
});

test("robarCarta", () => {
    const cartaAñadir: Carta = {
        numero: 1,
        color: "rojo",
    };
    const jugadorSinCarta: Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [],
    };
    const jugadorConCarta: Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [cartaAñadir],
    };
    const tableroInicial: Tablero = new Tablero(
        [cartaAñadir],
        [],
        [jugadorSinCarta],
        true
    );
    const tableroEsperado: Tablero = new Tablero(
        [],
        [],
        [jugadorConCarta],
        true
    );
    tableroInicial.robarCarta(jugadorSinCarta);
    expect(tableroInicial).toEqual(tableroEsperado);
});

test("robar2CartasConSolo1Centro", () => {
    const cartaMazoCentral: Carta = {
        numero: 1,
        color: "rojo",
    };
    const cartaMazoDescartes: Carta = {
        numero: 2,
        color: "azul",
    };
    const jugador: Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [],
    };
    const tableroInicial: Tablero = new Tablero(
        [cartaMazoCentral],
        [cartaMazoDescartes, cartaMazoDescartes],
        [jugador],
        true
    );
    tableroInicial.robarCarta(jugador);
    tableroInicial.robarCarta(jugador);
    expect(jugador.mano).toContainEqual(cartaMazoCentral);
    expect(jugador.mano).toContainEqual(cartaMazoDescartes);
});

test("jugarCartaNormal", () => {
    const cartaJugar: Carta = {
        numero: 1,
        color: "rojo",
    };
    const cartaMazo: Carta = {
        numero: 8,
        color: "rojo",
    };
    const jugadorConCarta: Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [cartaJugar],
    };
    const tableroInicial: Tablero = new Tablero(
        [],
        [cartaMazo],
        [jugadorConCarta],
        true
    );
    expect(tableroInicial.mazoDescartes.at(0)).toEqual(cartaMazo);
    tableroInicial.jugarCarta(cartaJugar, jugadorConCarta);
    expect(tableroInicial.mazoDescartes.at(0)).toEqual(cartaJugar);
});

test("jugarRoba2", () => {
    const cartaMazoCentral: Carta = {
        numero: 8,
        color: "verde",
    };
    const cartaMazoDescartes: Carta = {
        numero: 1,
        color: "azul",
    };

    const jugadorRobador: Jugador = {
        username: "jugador robador",
        puntos: 0,
        mano: [],
    };
    const jugadorQueJuegaCarta: Jugador = {
        username: "jugador jugador",
        puntos: 0,
        mano: [{ color: "azul", accion: "roba 2" }],
    };
    const tablero: Tablero = new Tablero(
        [cartaMazoCentral, cartaMazoCentral],
        [cartaMazoDescartes],
        [jugadorQueJuegaCarta, jugadorRobador],
        true
    );
    tablero.jugarCarta(
        { color: "azul", accion: "roba 2" },
        jugadorQueJuegaCarta
    );
    expect(jugadorRobador.mano).toHaveLength(2);
    expect(jugadorRobador.mano).toContain(cartaMazoCentral);
    jugadorRobador.mano.pop();
    expect(jugadorRobador.mano).toContain(cartaMazoCentral);
});

test("jugarCambioSentido", () => {
    const cartaMazoCentral: Carta = {
        numero: 8,
        color: "verde",
    };
    const cartaMazoDescartes: Carta = {
        numero: 1,
        color: "azul",
    };

    const jugadorSiguiente: Jugador = {
        username: "jugador siguiente",
        puntos: 0,
        mano: [],
    };
    const jugadorAnterior: Jugador = {
        username: "jugador anterior",
        puntos: 0,
        mano: [],
    };
    const jugadorQueJuegaCarta: Jugador = {
        username: "jugador jugador",
        puntos: 0,
        mano: [{ color: "azul", accion: "cambio sentido" }],
    };
    const tablero: Tablero = new Tablero(
        [cartaMazoCentral],
        [cartaMazoDescartes],
        [jugadorQueJuegaCarta, jugadorSiguiente, jugadorAnterior],
        true
    );
    expect(tablero.siguienteJugador()).toEqual(jugadorSiguiente);
    tablero.jugarCarta(
        { color: "azul", accion: "cambio sentido" },
        jugadorQueJuegaCarta
    );
    expect(tablero.jugadores[tablero.turno]).toEqual(jugadorAnterior);
});

test("jugarCambioColor", () => {
    const cartaMazoCentral: Carta = {
        numero: 8,
        color: "verde",
    };
    const cartaMazoDescartes: Carta = {
        numero: 1,
        color: "rojo",
    };

    const jugadorSiguiente: Jugador = {
        username: "jugador siguiente",
        puntos: 0,
        mano: [],
    };
    const jugadorAnterior: Jugador = {
        username: "jugador anterior",
        puntos: 0,
        mano: [],
    };
    const jugadorQueJuegaCarta: Jugador = {
        username: "jugador jugador",
        puntos: 0,
        mano: [{ colorCambio: "azul", accion: "cambio color" }],
    };
    const tablero: Tablero = new Tablero(
        [cartaMazoCentral],
        [cartaMazoDescartes],
        [jugadorQueJuegaCarta, jugadorSiguiente, jugadorAnterior],
        true
    );
    tablero.jugarCarta(
        { colorCambio: "azul", accion: "cambio color" },
        jugadorQueJuegaCarta
    );
    expect(tablero.mazoDescartes.at(0)?.color).toEqual("azul");
    console.log(tablero.ganador);
});
