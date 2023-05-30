export type Color = "rojo" | "verde" | "azul" | "amarillo"
export type Accion = "cambio color" | "cambio sentido" | "roba 2" | "roba 4" | "prohibido" 

export class Carta {
    numero?: number = 0;
    color?: Color
    accion?: Accion
    colorCambio?: Color
}
