export interface CreateUserDTO {
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    email: string;
    contrasena: string;
    telefono?: string;  
    genero?: string;  
    rut: string;
    fechaNacimiento: string;
    idRol?: number | null;
    direccion?: string;

  }
  
  
