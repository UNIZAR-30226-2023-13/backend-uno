import { Socket } from "socket.io";

const jugadoresSocket = new Map();

export function connectionHandler(socket: Socket) {
    console.log("soy elhandler " + JSON.stringify(socket.id));

    socket.on("registro", (username: string) => {
        jugadoresSocket.set(socket.id, username);
        console.log(jugadoresSocket);
    });
}
