import { Jugador } from './../../../src-ts/models/jugador'
import {Tablero} from "../../../src-ts/models/tablero"

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
