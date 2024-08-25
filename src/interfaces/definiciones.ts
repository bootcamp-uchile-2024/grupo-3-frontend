interface   Usuario {
    id: number;
    nombre: string;
    password: string;
    mail: string;
    carrito: CarritoCompra;
    pedidos: Pedido;
    medioPago: string;

}

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    stock: number;
}

interface CarritoCompra {
    productos: Producto[];
    total: number;
}

interface Pedido {
    id: number;
    productos: Producto[];
    total: number;
    fecha: Date;
}

interface medioPago {
    id: number;
    nombre: string;
    descripcion: string;
}