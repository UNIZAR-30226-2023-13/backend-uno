import { Socket } from "socket.io";

export function desconnectionHandler(socket: Socket) {
    socket.on("disconnect", () => {
        console.log("se desconecta: " + JSON.stringify(socket.id));
    });
}
