import { Socket } from "socket.io";

export function partidaHandler(socket: Socket) {
    socket.on("partida", () => {
        console.log("partida");
    });
}
