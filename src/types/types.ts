export interface User {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  email: string;
  fechaNacimiento: string;
  genero: string;
  rut: string;
  telefono: string;
  direccion: string;
  idRol: number;
  rol?: string;
  direcciones?: string[]; 
}
