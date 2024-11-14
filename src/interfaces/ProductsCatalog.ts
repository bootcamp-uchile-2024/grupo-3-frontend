export interface productsCatalog {
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
}