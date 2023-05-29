import { Jugador } from './../../../src-ts/models/jugador'
import { Carta } from './../../../src-ts/models/carta'
import {Tablero} from "../../../src-ts/models/tablero"

test('crearTableroVacio', ()=>{
    const numCartas: number = 108
    const tableroVacio = new Tablero()
    expect(tableroVacio.mazoCentral.length).toEqual(numCartas)
})

test('mezclarMazoCentral', ()=>{
    const tableroSinMezclar = new Tablero();
    const tableroMezclado = new Tablero()
    tableroMezclado.mezclarBarajaCentral();
    expect(tableroSinMezclar).not.toEqual(tableroMezclado)
})

test('anadirUnSoloJugador', ()=>{
    const jugador : Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: []
    }
    var tableroVacio = new Tablero ([],[],[],true)
    var tableroConJugador = new Tablero([],[],[jugador],true)
    tableroVacio.anadirJugador(jugador)
    expect(tableroVacio).toEqual(tableroConJugador)
});



test('anadirDosJugadores', ()=>{
    const jugador1 : Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: []
    }
    const jugador2 : Jugador = {
        username: "ismael",
        puntos: 0,
        mano: []
    }
    var tableroVacio = new Tablero ([],[],[],true)
    var tableroConJugadores = new Tablero([],[],[jugador1,jugador2],true)
    tableroVacio.anadirJugador(jugador1)
    tableroVacio.anadirJugador(jugador2)
    expect(tableroVacio).toEqual(tableroConJugadores)
});

test('eliminarUnSoloJugador', ()=>{
    const jugador : Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: []
    }
    var tableroVacio = new Tablero ([],[],[],true)
    var tableroConJugador = new Tablero([],[],[jugador],true)
    tableroConJugador.eliminarJugador(jugador)
    expect(tableroConJugador).toEqual(tableroVacio)
});

test('eliminarDosJugadores', ()=>{
    const jugador1 : Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: []
    }
    const jugador2 : Jugador = {
        username: "ismael",
        puntos: 0,
        mano: []
    }
    var tableroVacio = new Tablero ([],[],[],true)
    var tableroConJugadores = new Tablero([],[],[jugador1,jugador2],true)
    tableroConJugadores.eliminarJugador(jugador1)
    tableroConJugadores.eliminarJugador(jugador2)
    expect(tableroConJugadores).toEqual(tableroVacio)
});

test('eliminarJugadorNoExiste', ()=>{
    const jugador : Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: []
    }
    var tableroVacio = new Tablero ([],[],[],true)
    expect(tableroVacio.eliminarJugador(jugador)).toEqual(false)
});

test('robarCarta', ()=>{
    const cartaAñadir : Carta = {
        numero: 1,
        color: "rojo"
    }
    const jugadorSinCarta : Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: []
    }
    const jugadorConCarta : Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [
            cartaAñadir
        ]
    }
    var tableroInicial = new Tablero([cartaAñadir],[],[jugadorSinCarta],true)
    var tableroEsperado = new Tablero ([],[],[jugadorConCarta],true)
    tableroInicial.robarCarta(jugadorSinCarta)
    expect(tableroInicial).toEqual(tableroEsperado)
});

test('jugarCarta', ()=>{
    const cartaJugar : Carta = {
        numero: 1,
        color: "rojo"
    }
    const jugadorConCarta : Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: [
            cartaJugar
        ]
    }
    const jugadorSinCarta : Jugador = {
        username: "juancatalan",
        puntos: 0,
        mano: []
    }
    var tableroInicial = new Tablero([],[],[jugadorConCarta],true)
    var tableroEsperado = new Tablero ([],[cartaJugar],[jugadorSinCarta],true)
    tableroInicial.jugarCarta(cartaJugar,jugadorConCarta)
    expect(tableroInicial).toEqual(tableroEsperado)
});
