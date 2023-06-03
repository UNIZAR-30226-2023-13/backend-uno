export interface Partida {
    fecha: Date;
    jugadores: {
        nombre: string;
        esGanador: boolean;
    }[];
}
