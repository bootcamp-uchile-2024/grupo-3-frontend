export interface createProductData {
    nombre: string;
    precio: number;
    imagen?: string;
    descripcion: string;
    cantidad: number;
    familia: string;
    fotoperiodo: string;
    tipoRiego: string;
    petFriendly: boolean;
    color: string;
    id?: number;
}