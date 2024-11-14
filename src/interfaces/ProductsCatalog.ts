export interface Categoria {
  id: number;
  nombre: string;
}

export interface Planta {
  id_producto: number;
  petFriendly: boolean;
  toleranciaTemperatura: number;
  ciclo: boolean;
  altura: string;
  idEspecie: number;
  idColor: number;
  idFotoperiodo: number;
  idTipoRiego: number;
  idHabitoCrecimiento: number;
  habitoCrecimiento: string;
  especie: string;
  color: string;
  fotoPeriodo: string;
  tipoRiego: string;
}

export interface productsCatalog {
  id: number;
  SKU: string;
  nombre: string;
  idCategoria: number;
  precio: number;
  descripcion: string;
  imagen: string;
  cantidad: number;
  unidadesVendidas: number;
  puntuacion: number;
  ancho: number;
  alto: number;
  largo: number;
  peso: number;
  categoria: Categoria;
  planta: Planta;      
}