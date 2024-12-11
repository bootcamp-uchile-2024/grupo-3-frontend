interface Planta {
  petFriendly?: boolean;
  ciclo?: boolean;
  especie?: string;
  idColor?: number;
  idFotoperiodo?: number;
  idTipoRiego?: number;
  idHabitoCrecimiento?: number;
  idTamano?: number;
  idToleranciaTemperatura?: number;
  idEntorno?: number;
  idIluminacion?: number;
}

interface Macetero {
  idMarca: number;
  idTipoMacetero: number;
  material: string;
  forma: string;
  diametro: number;
  litros: number;
}

interface Accesorio {
  idMarca: number;
  idTipoAccesorio: number;
  idColor: number;
}

interface Insumo {
  idTipoInsumo: number;
  idMarca: number;
}

export interface CreateProductData {
  SKU: string;
  nombre: string;
  idCategoria: number;
  precio: number;
  descripcion: string;
  imagen: string; 
  stock: number;
  unidadesVendidas: number;
  puntuacion: number;
  ancho: number;
  alto: number;
  largo: number;
  peso: number;
  habilitado: boolean;
  planta?: Planta;
  macetero?: Macetero;
  accesorio?: Accesorio;
  insumo?: Insumo;
}