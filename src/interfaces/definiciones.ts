// Enum para medio de pago
enum MedioPago {
    DEBITO = 'debito',
    CREDITO = 'credito',
    // Otros posibles medios de pago
  }
  
  // Interfaz para CarroCompra
  interface CarroCompra {
    productos: Producto[];
    total: number;
  }
  
  // Interfaz para Pedido
  interface Pedido {
    id: number;
    fecha: Date;
    productos: Producto[];
    total: number;
  }
  
  // Interfaz Usuario
  interface Usuario {
    id: number;
    nombre: string;
    contrasena: string;
    mail: string;
    carrito: CarroCompra;
    pedidos: Pedido[];
    medioPago: MedioPago;
  }
  
   // Interfaz Producto
  interface Producto {
    id: number;
    SKU?: string;
    nombre: string;
    precio: number;
    imagen: string;
    descripcion: string;
    cantidad: number;
    unidadesVendidas: number;
    puntuacion: number;
    especie: string;
    petFriendly: boolean;
    color: string;
  }
  
