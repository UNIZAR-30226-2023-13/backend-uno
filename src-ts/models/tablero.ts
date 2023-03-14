import {Carta} from "./carta"
import {Jugador} from "./jugador"

export class Tablero {
    mazoCentral: Carta[] = []
    mazoDescartes: Carta[] = []
    jugadores: Jugador[] = []

    sentidoHorario: boolean = true
    turno: number = 0

    constructor(mazoCentral: Carta[], mazoDescartes: Carta[], jugadores: Jugador[], sentidoHorario: boolean) {
        this.mazoCentral = mazoCentral
        this.mazoDescartes = mazoDescartes
        this.jugadores = jugadores
        this.sentidoHorario = sentidoHorario
    }

    anadirJugador(nuevo_jugador: Jugador): boolean{
        if(this.jugadores.length < 4){
            this.jugadores.push(nuevo_jugador)
            return true
        }
        return false
    }

    robarCarta(jugador: Jugador): void{
        // Ejemplo
        const cartaRobada = this.mazoCentral.pop()
        cartaRobada ? jugador.mano.push(cartaRobada) : console.error("No habia más cartas para robar") 
    }
}
