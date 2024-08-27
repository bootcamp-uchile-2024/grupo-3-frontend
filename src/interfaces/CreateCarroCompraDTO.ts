import { Producto } from ''; // Falta por definir la ruta del archivo Producto

export interface CreateCarroCompraDTO {
    id: number;
    cantidad: number;
    producto: Producto;
}