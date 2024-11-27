export interface User {
    id: number;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    email: string;
    telefono: string;
    genero: string;
    rut: string;
    fechaNacimiento: string;
    tipoUsuarioId: number | string;
    tipoUsuario: string;
    direccion?: string;
  }