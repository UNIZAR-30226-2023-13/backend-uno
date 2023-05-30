import { Carta } from "./carta";

export interface Jugador {
    username: string;
    puntos: number;
    mano: Carta[];
}
