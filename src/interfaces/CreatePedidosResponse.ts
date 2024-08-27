
import { CreatePedidosDTO } from './CreatePedidosRequestDTO';

export interface CreatePedidosResponse {
    pedido: CreatePedidosDTO; // El pedido recién creado
    mensaje: string; // Un mensaje de confirmación o información adicional
}
