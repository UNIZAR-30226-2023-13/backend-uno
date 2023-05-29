import {Carta} from "./carta"
import {Jugador} from "./jugador"

import { Color, Accion } from "./carta"


export class Tablero {
    mazoCentral: Carta[] = []
    mazoDescartes: Carta[] = []
    jugadores: Jugador[] = []

    sentidoHorario: boolean = true
    turno: number = 0

    constructor(mazoCentral: Carta[], mazoDescartes: Carta[], jugadores: Jugador[], sentidoHorario: boolean);

    constructor();

    constructor(...args: Array<any>){
        // Si estamos creando el tablero a partir del mazoCentral, mazoDescartes, jugadores, sentidoHorario
        if (args.length === 4){
            const mazoCentral: Carta[] = args[0];
            const mazoDescartes: Carta[] = args[1];
            const jugadores: Jugador[] = args[2];
            const sentidoHorario: boolean = args[3];
            this.mazoCentral = mazoCentral
            this.mazoDescartes = mazoDescartes
            this.jugadores = jugadores
            this.sentidoHorario = sentidoHorario
    
        }
        // Si estamos creando el tablero desde el inicio
        else if (args.length === 0){
            const numeros: number[] = [1,2,3,4,5,6,7,8,9]
            const colores: Color[] = ["rojo", "verde", "azul", "amarillo"]
            const accionesColor: Accion[] = ["cambio sentido", "roba 2", "prohibido"]
            const accionesEspeciales: Accion[] = ["roba 4", "cambio color"]
            // Para cada color
            for (const color of colores){
                // Añado los numeros
                for (const numero of numeros){
                    const carta : Carta = {
                        numero: numero,
                        color: color
                    }
                    // Se añaden dos de cada carta
                    this.mazoCentral.push(carta)
                    this.mazoCentral.push(carta)
                }
                // Añado la 0
                const carta : Carta = {
                    numero: 0,
                    color: color
                }
                // Se añaden dos de cada carta
                this.mazoCentral.push(carta)
                // Añado las acciones que tienen color
                for (const accion of accionesColor){
                    const carta : Carta = {
                        color: color,
                        accion: accion
                    }
                    // Se añaden dos de cada carta
                    this.mazoCentral.push(carta)
                    this.mazoCentral.push(carta)
                }
            }
            // Añado las cartas especiales
            for (const accion of accionesEspeciales){
                const carta : Carta = {
                    accion: accion
                }
                // Se añaden dos de cada carta
                this.mazoCentral.push(carta, carta, carta, carta)
            }
        }
    }

    mezclarBarajaCentral(): void{
        let currentIndex: number = this.mazoCentral.length
        let randomIndex: number;

        // Mientras haya elementos sin mezclar.
        while (currentIndex != 0) {    
            // Escojo un elemento aleatoriamente.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            // And swap it with the current element.
            [this.mazoCentral[currentIndex], this.mazoCentral[randomIndex]] = [
                this.mazoCentral[randomIndex], this.mazoCentral[currentIndex]];
        }
    }

    repartirCartasIniciales(): void{
        let numCartasRepartir = 7
        while (numCartasRepartir > 0){
            for (let jugador of this.jugadores){
                const carta = this.mazoCentral.pop()
                if (carta){
                    jugador.mano.push(carta as Carta)    
                }
            }
            numCartasRepartir--;
        }
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
