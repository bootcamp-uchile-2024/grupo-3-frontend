import { FiltrarPedidosDTO } from './FiltrarPedidosRequestDTO';

export interface FiltrarPedidosResponse {
    pedidos: FiltrarPedidosDTO[];
    total?: number; // Opcional: Total de pedidos que cumplen con los criterios
}
