const jugadoresSocket: Map<string, string> = new Map<string, string>();

export function conectarJugador(username: string, socket: string) {
    jugadoresSocket.set(socket, username);
}

export function desconectarJugador(socket: string) {
    jugadoresSocket.delete(socket);
}

export function jugadoresConectados(): string[] {
    const jugadores = Array.from(jugadoresSocket.values());
    return jugadores;
}

export function obtenerUsernameSocket(socketID: string) {
    return jugadoresSocket.get(socketID);
}
