//DTO para la salida de productos 
export interface ProductoSalidaDTO {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    descripcion: string; 
    cantidad: number; 
    unidadesVendidas: number;
    puntuacion: number;
    especie: string;
    fotoPeriodo: string;
    tipoRiego: string; 
    petFriendly: boolean;
    color: string;
  }

//DTO para la salida de un conjunto de productos 
export interface ObtenerProductoDTO {
    total: number;
    productos: ProductoSalidaDTO[];
}

//DTO para obtener producto por ID
export interface ObtenerProductoIdDTO {
    producto: ProductoSalidaDTO | null;
}

//DTO para obtener producto por filtros
export interface ObtenerProductoFiltroDTO {
    total: number;
    productos: ProductoSalidaDTO[];
}