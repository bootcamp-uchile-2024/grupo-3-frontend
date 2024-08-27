// DTO para la solicitud de productos con filtros opcionales
export interface ObtenerProductosRequestDTO {
    // Aquí podemos agregar propiedades opcionales para filtros, ordenamientos, etc.
    filtroNombre?: string;
    filtroCategoria?: string;
    ordenamiento?: 'precio' | 'nombre' | 'puntuacion';
}

// DTO para la solicitud de productos más vendidos (podría no necesitar filtros)
export interface ObtenerProductosMasVendidosRequestDTO {
    // Aquí podemos agregar propiedades.
}

// DTO para la solicitud de productos recomendados por historial
export interface ObtenerProductosRecomendadosRequestDTO {
     // Aquí podemos agregar propiedades.
}

// DTO para la solicitud de productos por tips
export interface ObtenerProductosPorTipsRequestDTO {
     // Aquí podemos agregar propiedades.
}
