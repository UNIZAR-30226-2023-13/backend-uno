import { Socket } from "socket.io";
import { desconectarJugador } from "../services/usuariosConectados.service";

export function desconnectionHandler(socket: Socket) {
    socket.on("disconnect", () => {
        desconectarJugador(socket.id);
    });
}
