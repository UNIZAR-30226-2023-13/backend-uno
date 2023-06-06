import { Socket, Server as SocketIOServer } from "socket.io";
import {
    desconectarJugador,
    obtenerUsernameDeSocket,
} from "../services/usuariosConectados.service";
import {
    eliminarJugadorPartida,
    obtenerPartidaJugador,
} from "../services/partidas.service";
import { eliminarJugadorDeSala, obtenerSalaJuego } from "./partidaHandler";
import { Tablero } from "../models/tablero";

export function desconnectionHandler(io: SocketIOServer, socket: Socket) {
    socket.on("disconnect", () => {
        // Eliminarlo de la partida en la que este
        const username = obtenerUsernameDeSocket(socket);
        console.log("Desconexion: " + socket.id + " -> " + username);
        if (username && username !== undefined) {
            eliminarJugadorPartida(username);
            const partida: Tablero | null = obtenerPartidaJugador(username);
            // Eliminarlo de la sala
            const idSala: string | undefined = obtenerSalaJuego(socket);
            console.log("abandona la partida" + username);
            if (idSala) {
                socket.to(idSala).emit("partida:abandono", username);
                eliminarJugadorDeSala(socket);
                if (partida) {
                    io.to(idSala).emit("partida", partida);
                }
            }
        }

        // Marcar como desconectado

        desconectarJugador(socket);
    });
}
