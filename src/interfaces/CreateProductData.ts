export interface Categoria {
  id: number;
  nombre: string;
}

export interface Planta {
  id: number;
  nombre: string;
}

export interface createProductData {
  id?: number;
  SKU?: string;
  nombre: string;
  idCategoria?: number;
  precio: number;
  descripcion: string;
  imagen: string;
  cantidad: number;
  unidadesVendidas?: number;
  puntuacion?: number;
  ancho: number;
  alto: number;
  largo: number;
  peso: number;
  categoria?: Categoria;  
  planta?: Planta;        
}