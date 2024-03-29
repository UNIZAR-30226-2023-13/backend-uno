import { Socket, Server as SocketIOServer } from "socket.io";
import {
    obtenerSocketDeUsername,
    obtenerUsernameDeSocket,
} from "../services/usuariosConectados.service";
import { obtenerDatosBasicos } from "../services/login.service";
import { Persona } from "../models/persona";
import {
    anadirJugadorPartida,
    eliminarJugadorPartida,
    obtenerPartidaJugador,
} from "../services/partidas.service";
import { nanoid } from "nanoid";
import { Tablero } from "../models/tablero";
import { Jugador } from "../models/jugador";
import { Carta } from "../models/carta";

// Map del tipo: socket -> salaJuego
// donde una salaJuego es una room con varios jugadores
const salasJuego: Map<Socket, string> = new Map<Socket, string>();

export function obtenerSalaJuego(socket: Socket) {
    return salasJuego.get(socket);
}

export function eliminarJugadorDeSala(socket: Socket) {
    salasJuego.delete(socket);
}

export function partidaHandler(io: SocketIOServer, socket: Socket) {
    socket.on("buscarPartida", () => {
        const username: string | undefined = obtenerUsernameDeSocket(socket);
        if (username) {
            obtenerDatosBasicos(username).then(({ persona }) => {
                const usuario: Persona = persona;
                console.log("Busca partida: " + usuario.username);
                const comienza: boolean = anadirJugadorPartida(usuario);
                // Si comienza la partida
                if (comienza) {
                    const idSala = nanoid();
                    const partida: Tablero | null =
                        obtenerPartidaJugador(username);
                    if (partida) {
                        console.log("Creo la sala: " + idSala);
                        // Añado a los jugadores a una room para ello
                        console.log("Con jugadores: ");
                        for (const jugador of partida.jugadores) {
                            const socketJugador: Socket =
                                obtenerSocketDeUsername(jugador.username);
                            socketJugador.join(idSala);
                            salasJuego.set(
                                obtenerSocketDeUsername(jugador.username),
                                idSala
                            );
                            console.log("  - " + jugador.username);
                        }
                        io.to(idSala).emit("partida", partida);
                    }
                }
            });
        }
    });

    socket.on("jugarCarta", (mensaje, penultimaCarta = false) => {
        const idSala: string | undefined = salasJuego.get(socket);
        const username: string | undefined = obtenerUsernameDeSocket(socket);
        // Si esta registrado y tiene una salaDeJuego
        if (username && idSala) {
            const partida: Tablero | null = obtenerPartidaJugador(username);
            // Si existe la partida
            if (partida) {
                const jugador: Jugador | undefined =
                    partida.obtenerJugador(username);
                // Si pertenece a la partida
                if (jugador) {
                    const carta: Carta = mensaje;
                    const posible: boolean = partida.jugarCarta(
                        carta,
                        jugador,
                        penultimaCarta
                    );
                    if (posible) io.to(idSala).emit("partida", partida);
                }
            }
        }
    });

    socket.on("pasarTurno", () => {
        const idSala: string | undefined = salasJuego.get(socket);
        const username: string | undefined = obtenerUsernameDeSocket(socket);
        // Si esta registrado y tiene una salaDeJuego
        if (username && idSala) {
            const partida: Tablero | null = obtenerPartidaJugador(username);
            // Si existe la partida
            if (partida) {
                const jugador: Jugador | undefined =
                    partida.obtenerJugador(username);
                // Si pertenece a la partida
                if (jugador) {
                    const posible: boolean = partida.saltarTurno(jugador);
                    if (posible) io.to(idSala).emit("partida", partida);
                }
            }
        }
    });

    socket.on("robarCarta", () => {
        const idSala: string | undefined = salasJuego.get(socket);
        const username: string | undefined = obtenerUsernameDeSocket(socket);
        // Si esta registrado y tiene una salaDeJuego
        if (username && idSala) {
            const partida: Tablero | null = obtenerPartidaJugador(username);
            // Si existe la partida
            if (partida) {
                const jugador: Jugador | undefined =
                    partida.obtenerJugador(username);
                // Si pertenece a la partida
                if (jugador) {
                    const posible: boolean = partida.robarCarta(jugador);
                    if (posible) io.to(idSala).emit("partida", partida);
                }
            }
        }
    });

    socket.on("abandonarPartida", () => {
        const idSala: string | undefined = salasJuego.get(socket);
        const username: string | undefined = obtenerUsernameDeSocket(socket);
        // Si esta registrado y tiene una salaDeJuego
        if (username && idSala) {
            const partida: Tablero | null = obtenerPartidaJugador(username);
            // Si existe la partida
            if (partida && !partida.finalizado) {
                if (!partida.finalizado) {
                    eliminarJugadorPartida(username);
                    socket.to(idSala).emit("partida:abandono", username);
                    console.log("partida abandonada por: " + username);
                    // Envio la partida actualizada
                    socket.to(idSala).emit("partida", partida);
                }
                // Abandono la sala
                socket.leave(idSala);
                salasJuego.delete(socket);
            }
        }
    });
}
