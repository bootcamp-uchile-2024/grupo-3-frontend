export interface Imagen {
  ruta: string;
}

export interface PromocionDestacada {
  id: number;
  nombre: string;
  descripcion: string;
  valor: number;
  tipoDescuento: string;
  tipoPromocion: string;
  fechaInicio: string;
  fechaTermino: string;
}

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  cantidad: number;
  unidadesVendidas: number;
  puntuacion: number;
  familia?: string;
  fotoperiodo?: string;
  tipoRiego?: string;
  petFriendly?: boolean;
  color?: string;
  ancho: number;
  alto: number;
  largo: number;
  peso: number;
  stock?: number;
  imagenes?: Imagen[];
  promocionesDestacadas?: PromocionDestacada[];
}


  