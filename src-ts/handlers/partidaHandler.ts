import { Socket } from "socket.io";
import { obtenerUsernameSocket } from "../services/usuariosConectados.service";
import { obtenerCorreoPuntos } from "../services/login.service";
import { Persona } from "../models/persona";
import { anadirJugadorPartida } from "../services/partidas.service";

export function partidaHandler(socket: Socket) {
    socket.on("partida", () => {
        console.log("partida");
    });

    socket.on("buscarPartida", () => {
        const username: string | undefined = obtenerUsernameSocket(socket.id);
        if (username) {
            obtenerCorreoPuntos(username).then(({ persona }) => {
                const usuario: Persona = persona;
                console.log("Busca partida: " + usuario.username);
                const completa: boolean = anadirJugadorPartida(usuario);
                if (completa) {
                    console.log("Partida con 4 jugadores");
                }
            });
        }
    });
}
