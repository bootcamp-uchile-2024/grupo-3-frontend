interface Categoria {
    id: number;
    categoria: string;
  }
  
  interface Planta {
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
    especie: string;
    color: string;
    fotoPeriodo: string;
    tipoRiego: string;
    habitoCrecimiento: string;
  }
  
  interface Macetero {
    idProducto: number;
    idMarca: number;
    idTipoMacetero: number;
    material: string;
    forma: string;
    diametro: number;
    litros: number;
    marca: string;
    tipoMacetero: string;
  }
  
  interface Accesorio {
    idProducto: number;
    idMarca: number;
    idTipoAccesorio: number;
    idColor: number;
    marca: string;
    tipoAccesorio: string;
    color: string;
  }
  
  export interface ProductAdmin {
    id: number;
    SKU: string;
    nombre: string;
    idCategoria: number;
    precio: number;
    descripcion: string;
    imagen?: string;
    imagenes?: {ruta: string}[];
    stock: number;
    unidadesVendidas: number;
    puntuacion: number;
    ancho: number;
    alto: number;
    largo: number;
    peso: number;
    habilitado: boolean;
    categoria: Categoria; 
    planta?: Planta; 
    macetero?: Macetero;
    accesorio?: Accesorio; 
    insumo?: boolean;  
  }  

  export interface EditProductAdmin {
    SKU: string;
    nombre: string;
    idCategoria: number;
    precio: number;
    descripcion: string;
    stock: number;
    unidadesVendidas: number;
    puntuacion: number;
    ancho: number;
    alto: number;
    largo: number;
    peso: number;
    imagenes: {id_producto: number;
      ruta: string;
    }[]
    habilitado: boolean;
    planta?: Planta; 
    macetero?: Macetero;
    accesorio?: Accesorio; 
    insumo?: boolean;  
  }  
