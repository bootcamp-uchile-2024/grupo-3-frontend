import { ModificarPedidosIdDTO } from './ModificarPedidosRequestDTO';

export interface ModificarPedidosResponse {
    pedidoActualizado: ModificarPedidosIdDTO;
    mensaje?: string; 
}