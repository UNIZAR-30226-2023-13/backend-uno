import { Carta } from "./carta";
import { Jugador } from "./jugador";

import { Color, Accion } from "./carta";
import { anadirPartida } from "../services/historialPartidas.service";
import { anadirPuntos } from "../services/cuenta.service";

export class Tablero {
    mazoCentral: Carta[] = [];
    mazoDescartes: Carta[] = [];
    jugadores: Jugador[] = [];
    ganador: Jugador | null = null;
    finalizado = false;
    empezada = false;
    fecha: Date = new Date();

    puedeRobar = true;
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
        this.fecha = new Date();
    }

    numeroJugadores(): number {
        return this.jugadores.length;
    }

    siguienteJugador(): Jugador {
        let indJugador: number;
        if (this.sentidoHorario) {
            if (this.turno >= this.jugadores.length - 1) {
                indJugador = 0;
            } else {
                indJugador = this.turno + 1;
            }
        } else {
            if (this.turno === 0) {
                indJugador = this.jugadores.length - 1;
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
            // Comprobar si es un roba 4 o un cambio de color
            if (
                this.mazoCentral[currentIndex].accion == "roba 4" ||
                this.mazoCentral[currentIndex].accion == "cambio color"
            ) {
                this.mazoCentral[currentIndex].color = undefined;
                this.mazoCentral[currentIndex].colorCambio = undefined;
            }

            // Comprobar si es un roba 4 o un cambio de color
            if (
                this.mazoCentral[randomIndex].accion == "roba 4" ||
                this.mazoCentral[randomIndex].accion == "cambio color"
            ) {
                this.mazoCentral[randomIndex].color = undefined;
                this.mazoCentral[randomIndex].colorCambio = undefined;
            }

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
                this.turno = 0;
            }
        } else {
            this.turno--;
            if (this.turno < 0) {
                this.turno = this.jugadores.length - 1;
            }
        }
    }

    saltarTurno(jugador: Jugador): boolean {
        if (this.jugadores[this.turno] !== jugador && !this.puedeRobar) {
            return false;
        } else {
            this.pasarTurno();
            this.puedeRobar = true;
            return true;
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
        const indiceJugador = this.jugadores.findIndex(
            (jugador) => jugador.username === jugadorAEliminar.username
        );

        // Si el jugador no existe
        if (indiceJugador === -1) {
            return false;
        }

        // Si el jugador es anterior al turno
        if (indiceJugador < this.turno) {
            this.turno--;
        }
        // Si el jugador tiene el turno y esta en el borde final
        else if (
            indiceJugador === this.turno &&
            this.turno === this.jugadores.length - 1
        ) {
            if (this.sentidoHorario) {
                this.turno = 0;
            } else this.turno = this.jugadores.length - 2;
        } else if (indiceJugador === this.turno && !this.sentidoHorario) {
            if (indiceJugador === 0) {
                this.turno = this.jugadores.length - 1;
            }
            this.turno--;
        }

        this.mazoCentral.push(...jugadorAEliminar.mano);
        this.jugadores = this.jugadores.filter(
            (jugador) => jugador.username !== jugadorAEliminar.username
        );

        if (this.jugadores.length === 1 && !this.finalizado) {
            this.terminarPartida();
        }
        return true;
    }

    obtenerJugador(username: string): Jugador | undefined {
        return this.jugadores.find((jugador) => jugador.username === username);
    }

    robarCarta(jugador: Jugador, mandandoRobar = false): boolean {
        if (this.jugadores[this.turno] !== jugador && !mandandoRobar)
            return false;

        if (!this.puedeRobar) return false;

        // Si esta robando para si mismo ya no podra más
        if (!mandandoRobar) this.puedeRobar = false;

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
        return true;
    }

    jugarCarta(
        carta: Carta,
        jugador: Jugador,
        penultimaCarta = false
    ): boolean {
        const indiceCartaEliminar = jugador.mano.findIndex(
            (c) =>
                c.accion === carta.accion &&
                c.color === carta.color &&
                c.numero === carta.numero
        );
        // Si no es el turno del jugador o no tiene la carta
        if (
            this.jugadores[this.turno] !== jugador ||
            indiceCartaEliminar === -1
        ) {
            return false;
        }
        // Comprueba que es una carta jugable
        // Si es del mismo color
        const cartaCentral = this.mazoDescartes.at(0);
        if (
            cartaCentral &&
            ((carta.color === cartaCentral.color &&
                carta.color !== undefined) ||
                (carta.numero === cartaCentral.numero &&
                    carta.numero !== undefined) ||
                (carta.accion === cartaCentral.accion &&
                    carta.accion !== undefined &&
                    (carta.accion === "roba 2" ||
                        carta.accion === "cambio sentido" ||
                        carta.accion === "prohibido")))
        ) {
            // Si es una carta de accion
            if (carta.accion) {
                switch (carta.accion) {
                    case "roba 2":
                        this.robarCarta(this.siguienteJugador(), true);
                        this.robarCarta(this.siguienteJugador(), true);
                        break;
                    case "cambio sentido":
                        this.sentidoHorario = !this.sentidoHorario;
                        break;
                    case "prohibido":
                        this.pasarTurno();
                        break;
                }
            }
            jugador.mano.splice(indiceCartaEliminar, 1);
            this.mazoDescartes.unshift(carta);
            // Pasar el turno
            this.puedeRobar = true;
            this.pasarTurno();
        }
        // Si es una carta que se puede jugar aunque no sea del mismo color
        else if (carta.accion === "cambio color") {
            // Eliminar la carta y añadirla al mazoDescartes
            jugador.mano.splice(indiceCartaEliminar, 1);
            carta.color = carta.colorCambio;
            this.mazoDescartes.unshift(carta);
            // Pasar el turno
            this.pasarTurno();
        } else if (carta.accion === "roba 4") {
            this.robarCarta(this.siguienteJugador(), true);
            this.robarCarta(this.siguienteJugador(), true);
            this.robarCarta(this.siguienteJugador(), true);
            this.robarCarta(this.siguienteJugador(), true);
            // Eliminar la carta y añadirla al mazoDescartes
            jugador.mano.splice(indiceCartaEliminar, 1);
            carta.color = carta.colorCambio;
            this.mazoDescartes.unshift(carta);
            // Pasar el turno
            this.puedeRobar = true;
            this.pasarTurno();
        } else {
            return false;
        }

        // Si deberia haber marcado UNO! y no lo hizo
        if (jugador.mano.length === 2 && !penultimaCarta) {
            this.robarCarta(jugador, true);
            this.robarCarta(jugador, true);
        }

        if (jugador.mano.length === 0) {
            this.terminarPartida();
        }

        return true;
    }

    terminarPartida() {
        if (this.empezada) {
            let minimoCartas = Number.MAX_SAFE_INTEGER;
            this.finalizado = true;
            for (const jugador of this.jugadores) {
                if (jugador.mano.length < minimoCartas) {
                    this.ganador = jugador;
                    minimoCartas = jugador.mano.length;
                }
            }
            anadirPartida(this);
            // Actualizo los puntos de los jugadores
            if (this.ganador) {
                anadirPuntos(
                    this.ganador.username,
                    2.5 * this.jugadores.length
                );
            }
        }
    }
}
