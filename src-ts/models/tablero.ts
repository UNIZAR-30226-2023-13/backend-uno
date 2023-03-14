import {Carta} from "./carta"
import {Jugador} from "./jugador"

class Tablero {
    mazoCentral: Carta[] = []
    mazoDescartes: Carta[] = []
    jugadores: Jugador[] = []

    sentidoHorario: boolean = true
    turno: number = 0

    constructor(prueba: String) {
        
    }
}
