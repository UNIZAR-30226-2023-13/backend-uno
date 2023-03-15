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

    pasarTurno(): void{
        if(this.sentidoHorario){
            this.turno++
            if(this.turno>=this.jugadores.length){
                this.turno--
            }
        }
        else {
            this.turno--
            if(this.turno<0){
                this.turno=this.jugadores.length-1
            }
        }
    }

    anadirJugador(nuevo_jugador: Jugador): boolean{
        if(this.jugadores.length < 4){
            this.jugadores.push(nuevo_jugador)
            return true
        }
        return false
    }

    eliminarJugador(jugadorAEliminar: Jugador): boolean{
        if(!this.jugadores.includes(jugadorAEliminar)){
            return false
        }
        else{
            this.jugadores = this.jugadores.filter((j) =>
                j.username!==jugadorAEliminar.username
            )
            return true
        }
    }

    robarCarta(jugador: Jugador): void{
        // Ejemplo
        const cartaRobada = this.mazoCentral.pop()
        cartaRobada ? jugador.mano.push(cartaRobada) : console.error("No habia más cartas para robar") 
    }

    jugarCarta(carta: Carta, jugador: Jugador){
        jugador.mano = jugador.mano.filter((c) => c!==carta)
        // EFECTO DE LA CARTA
        if(true){
            this.mazoDescartes.unshift(carta)
        }
    }
}
