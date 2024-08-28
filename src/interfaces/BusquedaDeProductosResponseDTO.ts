// DTO para la salida de productos
export interface ProductoSalidaDTO {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    descripcion: string; 
    cantidad: number; 
    unidadesVendidas: number;
    puntuacion: number;
    familia: string;
    fotoPeriodo: string;
    tipoRiego: string; 
    petFriendly: boolean;
    color: string;
}

// DTO para la salida de un conjunto de productos
export interface ObtenerProductosResponseDTO {
    total: number;
    productos: ProductoSalidaDTO[];
}

// DTO para obtener producto por ID
export interface ObtenerProductoIdResponseDTO {
    producto: ProductoSalidaDTO | null;
}

// DTO para obtener productos por filtros
export interface ObtenerProductosFiltroResponseDTO {
    total: number;
    productos: ProductoSalidaDTO[];
}
