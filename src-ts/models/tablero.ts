import { Carta } from "./carta";
import { Jugador } from "./jugador";

import { Color, Accion } from "./carta";

export class Tablero {
    mazoCentral: Carta[] = [];
    mazoDescartes: Carta[] = [];
    jugadores: Jugador[] = [];
    ganador: Jugador | null = null;
    finalizado = false;
    empezada = false;

    sentidoHorario = true;
    turno = 0;

    constructor(
        mazoCentral: Carta[],
        mazoDescartes: Carta[],
        jugadores: Jugador[],
        sentidoHorario: boolean
    );

    constructor();

    constructor(...args: Array<unknown>) {
        // Si estamos creando el tablero a partir del mazoCentral, mazoDescartes, jugadores, sentidoHorario
        if (args.length === 4) {
            const mazoCentral: Carta[] = args[0] as Carta[];
            const mazoDescartes: Carta[] = args[1] as Carta[];
            const jugadores: Jugador[] = args[2] as Jugador[];
            const sentidoHorario: boolean = args[3] as boolean;
            this.mazoCentral = mazoCentral;
            this.mazoDescartes = mazoDescartes;
            this.jugadores = jugadores;
            this.sentidoHorario = sentidoHorario;
        }
        // Si estamos creando el tablero desde el inicio
        else if (args.length === 0) {
            const numeros: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const colores: Color[] = ["rojo", "verde", "azul", "amarillo"];
            const accionesColor: Accion[] = [
                "cambio sentido",
                "roba 2",
                "prohibido",
            ];
            const accionesEspeciales: Accion[] = ["roba 4", "cambio color"];
            // Para cada color
            for (const color of colores) {
                // Añado los numeros
                for (const numero of numeros) {
                    const carta: Carta = {
                        numero: numero,
                        color: color,
                    };
                    // Se añaden dos de cada carta
                    this.mazoCentral.push(carta);
                    this.mazoCentral.push(carta);
                }
                // Añado la 0
                const carta: Carta = {
                    numero: 0,
                    color: color,
                };
                // Se añaden dos de cada carta
                this.mazoCentral.push(carta);
                // Añado las acciones que tienen color
                for (const accion of accionesColor) {
                    const carta: Carta = {
                        color: color,
                        accion: accion,
                    };
                    // Se añaden dos de cada carta
                    this.mazoCentral.push(carta);
                    this.mazoCentral.push(carta);
                }
            }
            // Añado las cartas especiales
            for (const accion of accionesEspeciales) {
                const carta: Carta = {
                    accion: accion,
                };
                // Se añaden dos de cada carta
                this.mazoCentral.push(carta, carta, carta, carta);
            }
        }
    }

    comenzarPartida() {
        this.empezada = true;
        this.mezclarBarajaCentral(true);
        this.repartirCartasIniciales();
        //console.log(this);
        console.log(JSON.stringify(this, null, 2));
    }

    numeroJugadores(): number {
        return this.jugadores.length;
    }

    siguienteJugador(): Jugador {
        let indJugador: number;
        if (this.sentidoHorario) {
            if (this.turno >= this.jugadores.length) {
                indJugador = 0;
            } else {
                indJugador = this.turno + 1;
            }
        } else {
            if (this.turno === 0) {
                indJugador = this.jugadores.length;
            } else {
                indJugador = this.turno - 1;
            }
        }
        return this.jugadores[indJugador];
    }

    mezclarBarajaCentral(primeraVez = false): void {
        let currentIndex: number = this.mazoCentral.length;
        let randomIndex: number;

        // Mientras haya elementos sin mezclar.
        while (currentIndex != 0) {
            // Escojo un elemento aleatoriamente.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [this.mazoCentral[currentIndex], this.mazoCentral[randomIndex]] = [
                this.mazoCentral[randomIndex],
                this.mazoCentral[currentIndex],
            ];
        }

        // Eligo una carta como la carta mazo de descartes
        // Si es el barajeo inicial
        if (primeraVez) {
            let carta = this.mazoCentral.pop();
            carta = {
                accion: "cambio color",
            };
            // Mientras sea una carta de accion
            while (carta && carta.accion) {
                // La añadimos al fondo
                this.mazoCentral.unshift(carta);
                // Cogemos otra carta del mazo central
                carta = this.mazoCentral.pop();
            }
            if (carta) {
                this.mazoDescartes.push(carta as Carta);
            }
        }
    }

    repartirCartasIniciales(): void {
        let numCartasRepartir = 7;
        while (numCartasRepartir > 0) {
            for (const jugador of this.jugadores) {
                const carta = this.mazoCentral.pop();
                if (carta) {
                    jugador.mano.push(carta as Carta);
                }
            }
            numCartasRepartir--;
        }
    }

    pasarTurno(): void {
        if (this.sentidoHorario) {
            this.turno++;
            if (this.turno >= this.jugadores.length) {
                this.turno--;
            }
        } else {
            this.turno--;
            if (this.turno < 0) {
                this.turno = this.jugadores.length - 1;
            }
        }
    }

    anadirJugador(nuevoJugador: Jugador): boolean {
        if (this.jugadores.length < 4) {
            this.jugadores.push(nuevoJugador);
            return true;
        }
        return false;
    }

    eliminarJugador(jugadorAEliminar: Jugador): boolean {
        if (!this.jugadores.includes(jugadorAEliminar)) {
            return false;
        }
        // Si el jugador si existe
        else {
            // Meto su mano en el mazo central
            this.mazoCentral.push(...jugadorAEliminar.mano);

            this.jugadores = this.jugadores.filter(
                (j) => j.username !== jugadorAEliminar.username
            );
            return true;
        }
    }

    robarCarta(jugador: Jugador): void {
        const cartaRobada = this.mazoCentral.pop();
        // Si habia cartas en el mazo central
        if (cartaRobada) {
            // Lo añado a la mano del jugador
            jugador.mano.push(cartaRobada);
        }
        // Si no habia cartas, debo mezclar las del mazo de descartes
        else {
            // Guardo la ultima mazo de descartes
            const ultimaCarta = this.mazoDescartes.pop();
            this.mazoCentral = Array.from(this.mazoDescartes);
            if (ultimaCarta) {
                this.mazoDescartes = [ultimaCarta];
            }
            // Mezclo el mazo central
            this.mezclarBarajaCentral();
            // Roba la carta que toca del nuevo mazo
            this.robarCarta(jugador);
        }
    }

    jugarCarta(carta: Carta, jugador: Jugador, penultimaCarta = false): void {
        // Si deberia haber marcado UNO! y no lo hizo
        if (jugador.mano.length === 2 && !penultimaCarta) {
            this.robarCarta(jugador);
            this.robarCarta(jugador);
        }
        // Comprueba que es una carta jugable
        // Si es del mismo color
        const cartaCentral = this.mazoDescartes.at(0);
        if (cartaCentral && carta.color === cartaCentral.color) {
            // Si no es una carta de accion
            if (carta.accion) {
                switch (carta.accion) {
                    case "roba 2":
                        this.robarCarta(this.siguienteJugador());
                        this.robarCarta(this.siguienteJugador());
                        break;
                    case "cambio sentido":
                        this.sentidoHorario = !this.sentidoHorario;
                        break;
                    case "prohibido":
                        this.pasarTurno();
                        break;
                }
            }
            // Eliminar la carta y añadirla al mazoDescartes
            jugador.mano = jugador.mano.filter((c) => c !== carta);
            this.mazoDescartes.unshift(carta);
            // Pasar el turno
            this.pasarTurno();
        }
        // Si es una carta que se puede jugar aunque no sea del mismo color
        else if (carta.accion === "cambio color") {
            // Eliminar la carta y añadirla al mazoDescartes
            jugador.mano = jugador.mano.filter((c) => c !== carta);
            carta.color = carta.colorCambio;
            this.mazoDescartes.unshift(carta);
            // Pasar el turno
            this.pasarTurno();
        } else if (carta.accion === "roba 4") {
            this.robarCarta(this.siguienteJugador());
            this.robarCarta(this.siguienteJugador());
            this.robarCarta(this.siguienteJugador());
            this.robarCarta(this.siguienteJugador());
            // Eliminar la carta y añadirla al mazoDescartes
            jugador.mano = jugador.mano.filter((c) => c !== carta);
            carta.color = carta.colorCambio;
            this.mazoDescartes.unshift(carta);
            // Pasar el turno
            this.pasarTurno();
        }

        if (jugador.mano.length === 0) {
            this.ganador = jugador;
            this.finalizado = true;
        }
    }
}
