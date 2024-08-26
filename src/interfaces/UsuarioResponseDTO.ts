interface UsuarioDTO {
    id: number;
    nombre: string;
    mail: string;
    carrito: CarroCompra;
    pedidos: Pedido[];
    medioPago: MedioPago;
  }
  