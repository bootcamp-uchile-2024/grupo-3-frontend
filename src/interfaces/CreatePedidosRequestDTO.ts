
export interface CreatePedidosDTO{
    idUsuaruio: number;
    tipoDespacho: string;
    tipoPago: string;
    carrito: string[];
    fechaEntrega: Date;
}