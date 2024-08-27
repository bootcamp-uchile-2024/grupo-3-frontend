// DTO para solicitar un producto por ID
export interface ObtenerProductoIdRequestDTO {
    id: number;
}

// DTO para solicitar productos con filtros
export interface ObtenerProductosFiltroRequestDTO {
    filtroNombre?: string;
    filtroPrecioMin?: number;
    filtroPrecioMax?: number;
    filtroFotoPeriodo?: string;
    filtroFotoRiego?: string;
    filtroPetFriendly?: boolean;
    filtroColor?: string;
}

// DTO para solicitar un conjunto de productos (sin filtros específicos)
export interface ObtenerProductosRequestDTO {
    // Puedes agregar parámetros de paginación o búsqueda aquí si es necesario
    pagina?: number;
}
