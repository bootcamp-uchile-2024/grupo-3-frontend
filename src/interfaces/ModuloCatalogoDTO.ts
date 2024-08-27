//DTO para el producto de catalogo
interface ProductoDTO {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
}

interface ProductosConTotalDTO {
    total: number;
    productos: ProductoDTO[];
}

export class CatalogoService {
    // Método genérico para retornar productos
    private obtenerProductosBase(productos: ProductoDTO[]): ProductosConTotalDTO {
        return { total: productos.length, productos };
    }

    // Obtener todos los productos
    obtenerTodosLosProductos(): ProductosConTotalDTO {
        const productos: ProductoDTO[] = [
            // Array de ProductoDTO con todos los productos.
        ];
        return this.obtenerProductosBase(productos);
    }

    // Obtener productos más vendidos
    obtenerProductosMasVendidos(): ProductosConTotalDTO {
        const productos: ProductoDTO[] = [
            // Array de ProductoDTO con todos los productos más vendidos.
        ];
        return this.obtenerProductosBase(productos);
    }

    // Obtener productos por puntuación
    obtenerProductosPorPuntuacion(): ProductosConTotalDTO {
        const productos: ProductoDTO[] = [
            // Array de ProductoDTO con los productos mejor puntuados.
        ];
        return this.obtenerProductosBase(productos);
    }

    // Obtener productos recomendados por historial
    obtenerProductosRecomendados(): ProductosConTotalDTO {
        const productos: ProductoDTO[] = [
            // Array de ProductoDTO con los productos recomendados para el usuario.
        ];
        return this.obtenerProductosBase(productos);
    }

    // Obtener productos por tips
    obtenerProductosPorTips(): ProductosConTotalDTO {
        const productos: ProductoDTO[] = [
            // Array de ProductoDTO con los productos según tips.
        ];
        return this.obtenerProductosBase(productos);
    }
}
