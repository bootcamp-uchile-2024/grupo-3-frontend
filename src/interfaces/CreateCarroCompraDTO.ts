import { Producto } from ''; // Falta la ruta del archivo Producto

interface CreateCarroCompraDTO {
    id: number;
    cantidad: number;
    producto: Producto;
}