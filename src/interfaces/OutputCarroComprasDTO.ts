export interface OutputCarroComprasDTO {
    id: number;
    idUsuario: number;
    cantidad: number;
    productos: [string];
    precioTotal: number;
}