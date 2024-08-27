import { ModificarPedidosIdDTO } from './ModificarPedidosRequestDTO';

export interface ModificarPedidosResponse {
    pedidoActualizado: ModificarPedidosIdDTO;
    mensaje?: string; // Opcional: Mensaje de confirmación o información adicional
}
