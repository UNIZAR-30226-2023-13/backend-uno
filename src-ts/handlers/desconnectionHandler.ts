import { Socket } from "socket.io";
import {
    desconectarJugador,
    obtenerUsernameDeSocket,
} from "../services/usuariosConectados.service";
import { eliminarJugadorPartida } from "../services/partidas.service";
import { obtenerSalaJuego } from "./partidaHandler";

export function desconnectionHandler(socket: Socket) {
    socket.on("disconnect", () => {
        // Eliminarlo de la partida en la que este
        const username = obtenerUsernameDeSocket(socket);
        console.log("Desconexion: " + socket.id + " -> " + username);
        if (username) {
            eliminarJugadorPartida(username);
            // Eliminarlo de la sala
            const idSala: string | undefined = obtenerSalaJuego(socket);
            if (idSala) {
                socket.to(idSala).emit("partida:abandono", username);
            }
        }

        // Marcar como desconectado
        desconectarJugador(socket);
    });
}
