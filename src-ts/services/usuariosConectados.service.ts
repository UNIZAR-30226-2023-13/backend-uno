import { Socket } from "socket.io";

const jugadorDeSocket: Map<Socket, string> = new Map<Socket, string>();
const socketDeJugador: Map<string, Socket> = new Map<string, Socket>();

export function conectarJugador(username: string, socket: Socket) {
    jugadorDeSocket.set(socket, username);
    socketDeJugador.set(username, socket);
}

export function desconectarJugador(socket: Socket) {
    const username: string | undefined = jugadorDeSocket.get(socket);
    if (username) {
        socketDeJugador.delete(username);
    }
    jugadorDeSocket.delete(socket);
}

export function jugadoresConectados(): string[] {
    const jugadores = Array.from(jugadorDeSocket.values());
    return jugadores;
}

export function obtenerUsernameDeSocket(socketID: Socket): string {
    return jugadorDeSocket.get(socketID) || "";
}

export function obtenerSocketDeUsername(username: string): Socket {
    return socketDeJugador.get(username) || ({} as Socket);
}
