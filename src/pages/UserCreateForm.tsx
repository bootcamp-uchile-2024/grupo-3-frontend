import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserCreationForm.css';
import { validateEmail, validatePassword } from '../utils/validators';

interface CreateUserDTO {
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  email: string;
  contrasena: string;
  telefono?: string;
  genero?: string;
  rut: string;
  fechaNacimiento: string;
  tipoUsuarioId: number;
}

type UserCreationFormProps = {
  onUserCreated?: () => void;
  isAdmin: boolean; // Propiedad que indica si el usuario es administrador
};

const UserCreationForm: React.FC<UserCreationFormProps> = ({ onUserCreated, isAdmin }) => {
  const [formData, setFormData] = useState<CreateUserDTO>({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: '',
    telefono: '', 
    genero: '',  
    rut: '',
    fechaNacimiento: '',
    tipoUsuarioId: 0,
    contrasena: '',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: '',
    telefono: '',
    genero: '',
    rut: '',
    fechaNacimiento: '',
    tipoUsuarioId: '',
    contrasena: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validate = () => {
    const newErrors = {
      nombre: formData.nombre ? '' : 'El nombre es obligatorio',
      apellido: formData.apellido ? '' : 'El apellido es obligatorio',
      nombreUsuario: formData.nombreUsuario ? '' : 'El nombre de usuario es obligatorio',
      email: validateEmail(formData.email) || '', 
      contrasena: validatePassword(formData.contrasena) || '', 
      telefono: formData.telefono ? '' : '',
      genero: formData.genero ? '' : '',
      rut: formData.rut ? '' : 'El RUT es obligatorio',
      fechaNacimiento: formData.fechaNacimiento ? '' : 'La fecha de nacimiento es obligatoria',
      tipoUsuarioId: isAdmin && formData.tipoUsuarioId > 0 ? '' : 'El tipo de usuario es obligatorio y debe ser un número válido',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const userData: CreateUserDTO = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        nombreUsuario: formData.nombreUsuario,
        email: formData.email,
        telefono: formData.telefono,
        genero: formData.genero,
        rut: formData.rut,
        fechaNacimiento: formData.fechaNacimiento ? formData.fechaNacimiento : '',
        tipoUsuarioId: formData.tipoUsuarioId,
        contrasena: formData.contrasena,
      };

      console.log('Datos a enviar:', userData);

      setIsSubmitting(true);

      try {
        const response = await fetch('http://localhost:8080/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el usuario');
        }

        const data = await response.json();
        console.log('Usuario creado:', data);

        alert('¡Usuario creado exitosamente!');

        setFormData({
          nombre: '',
          apellido: '',
          nombreUsuario: '',
          email: '',
          telefono: '',
          genero: '',
          rut: '',
          fechaNacimiento: '',
          tipoUsuarioId: 0,
          contrasena: '',
        });

        setErrors({
          nombre: '',
          apellido: '',
          nombreUsuario: '',
          email: '',
          telefono: '',
          genero: '',
          rut: '',
          fechaNacimiento: '',
          tipoUsuarioId: '',
          contrasena: '',
        });

        if (onUserCreated) onUserCreated();
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al crear el usuario:', error.message);
          alert(`Error al crear el usuario: ${error.message}. Intente nuevamente.`);
        } else {
          console.error('Error desconocido:', error);
          alert('Error al crear el usuario. Intente nuevamente.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="user-creation-container relative-top">
      <form onSubmit={handleSubmit} className="user-creation-form">
        <h2>Crear Usuario</h2>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
          />
          {errors.nombre && <p className="text-danger">{errors.nombre}</p>}
        </div>

        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
          />
          {errors.apellido && <p className="text-danger">{errors.apellido}</p>}
        </div>

        <div>
          <label>Nombre de usuario:</label>
          <input
            type="text"
            name="nombreUsuario"
            value={formData.nombreUsuario}
            onChange={handleInputChange}
          />
          {errors.nombreUsuario && <p className="text-danger">{errors.nombreUsuario}</p>}
        </div>

        <div>
          <label>Correo electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleInputChange}
          />
          {errors.contrasena && <p className="text-danger">{errors.contrasena}</p>}
        </div>

        <div>
          <label>RUT:</label>
          <input
            type="text"
            name="rut"
            value={formData.rut}
            onChange={handleInputChange}
          />
          {errors.rut && <p className="text-danger">{errors.rut}</p>}
        </div>

        <div>
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
          />
          {errors.fechaNacimiento && <p className="text-danger">{errors.fechaNacimiento}</p>}
        </div>

        {isAdmin && (
          <div>
            <label>Tipo de usuario ID:</label>
            <input
              type="number"
              name="tipoUsuarioId"
              value={formData.tipoUsuarioId}
              onChange={handleInputChange}
            />
            {errors.tipoUsuarioId && <p className="text-danger">{errors.tipoUsuarioId}</p>}
          </div>
        )}

        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
          />
          {errors.telefono && <p className="text-danger">{errors.telefono}</p>}
        </div>

        <div>
          <label>Género:</label>
          <input
            type="text"
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
          />
          {errors.genero && <p className="text-danger">{errors.genero}</p>}
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
};

export default UserCreationForm;









