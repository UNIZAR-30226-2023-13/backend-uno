import { Socket } from "socket.io";
import {
    desconectarJugador,
    obtenerUsernameDeSocket,
} from "../services/usuariosConectados.service";
import { eliminarJugadorPartida } from "../services/partidas.service";

export function desconnectionHandler(socket: Socket) {
    socket.on("disconnect", () => {
        // Eliminarlo de la partida en la que este
        const username = obtenerUsernameDeSocket(socket);
        console.log("Desconexion: " + socket.id + " -> " + username);
        if (username) {
            eliminarJugadorPartida(username);
        }

        // Marcar como desconectado
        desconectarJugador(socket);
    });
}
