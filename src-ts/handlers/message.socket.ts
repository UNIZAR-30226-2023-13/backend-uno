import { Socket, Server as SocketIOServer } from "socket.io";

export function mensajeHandler(io: SocketIOServer, socket: Socket) {
    socket.on("message:json", (json) => {
        console.log("soy un json" + json);
    });
    socket.on("message:text", (text) => {
        console.log("soy un texto" + text);
    });
}
