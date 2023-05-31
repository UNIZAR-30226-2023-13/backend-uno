import { Socket } from "socket.io";
import {
    conectarJugador,
    jugadoresConectados,
} from "../services/usuariosConectados.service";

export function connectionHandler(socket: Socket) {
    console.log("soy elhandler " + JSON.stringify(socket.id));

    socket.on("registro", (username: string) => {
        conectarJugador(username, socket.id);
    });

    socket.on("obtenerUsuarios", () => {
        console.log(jugadoresConectados());
        socket.emit("obtenerUsuarios", jugadoresConectados());
    });
}
