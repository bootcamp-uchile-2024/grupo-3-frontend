import { FiltrarPedidosDTO } from './FiltrarPedidosRequestDTO';

export interface FiltrarPedidosResponse {
    pedidos: FiltrarPedidosDTO[];
    total?: number;
}
