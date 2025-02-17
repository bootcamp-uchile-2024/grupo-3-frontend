export interface CatalogFilters {
    page: number;
    pageSize: number;
    idEntorno?: number;
    petFriendly?: boolean;
    puntuacion: number;
    maxPrecio?: number;
    minPrecio?: number;
    planta: {
    idToleranciaTemperatura?: number;
    idIluminacion?: number;
    idTipoRiego?: number;
    idTamano?: number;
    }
    ordenarPor?: string;
    orden?:'ASC'| 'DESC';
}