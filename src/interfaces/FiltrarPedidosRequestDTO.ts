
export interface FiltrarPedidosDTO{
    id: number;
    idUsuario: number;
    fechaCreacion: Date;
    estado: string;
    tipoDespacho: string;
    tipoPago: string;
    carrito: string[];
    fechaEntrega: Date;
}