import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserCreationForm.css';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators';
import { createUserDTO } from '../interfaces/CreateUserDTO';

type UserCreationFormProps = {
  onUserCreated?: () => void;
};

const UserCreationForm: React.FC<UserCreationFormProps> = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    genero: '',
    rut: '',
    fechaNacimiento: '',
    contrasena: '',
    confirmPassword: '',
    tipoUsuarioId: 3,
  });

  const [errors, setErrors] = useState({
    nombreUsuario: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    genero: '',
    rut: '',
    fechaNacimiento: '',
    contrasena: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Limpiar el error del campo cuando el usuario lo modifica
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    if (name === 'contrasena' || name === 'confirmPassword') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {
      nombreUsuario: validateUsername(formData.nombreUsuario),
      nombre: formData.nombre ? '' : 'El nombre es obligatorio',
      apellido: formData.apellido ? '' : 'El apellido es obligatorio',
      email: validateEmail(formData.email),
      telefono: formData.telefono ? '' : 'El teléfono es obligatorio',
      genero: formData.genero ? '' : 'El género es obligatorio',
      rut: formData.rut ? '' : 'El RUT es obligatorio',
      fechaNacimiento: formData.fechaNacimiento ? '' : 'La fecha de nacimiento es obligatoria',
      contrasena: validatePassword(formData.contrasena),
      confirmPassword: validateConfirmPassword(formData.contrasena, formData.confirmPassword),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const userData: createUserDTO = {
        nombreUsuario: formData.nombreUsuario,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        genero: formData.genero,
        rut: formData.rut,
        fechaNacimiento: formData.fechaNacimiento,
        contrasena: formData.contrasena,
        confirmPassword: formData.confirmPassword,
        tipoUsuarioId: formData.tipoUsuarioId,
      };

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
          nombreUsuario: '',
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          genero: '',
          rut: '',
          fechaNacimiento: '',
          contrasena: '',
          confirmPassword: '',
          tipoUsuarioId: 3,
        });

        setErrors({
          nombreUsuario: '',
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          genero: '',
          rut: '',
          fechaNacimiento: '',
          contrasena: '',
          confirmPassword: '',
        });

        if (onUserCreated) onUserCreated();
      } catch (error) {
        console.error('Error al crear el usuario:', error);
        alert('Error al crear el usuario. Intente nuevamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="user-creation-container relative-top">
      <form onSubmit={handleSubmit} className="user-creation-form">
        <h2>Crear Usuario--</h2>
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
          <label>Nombre:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} />
          {errors.nombre && <p className="text-danger">{errors.nombre}</p>}
        </div>

        <div>
          <label>Apellido:</label>
          <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} />
          {errors.apellido && <p className="text-danger">{errors.apellido}</p>}
        </div>

        <div>
          <label>Correo electrónico:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>

        <div>
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} />
          {errors.telefono && <p className="text-danger">{errors.telefono}</p>}
        </div>

        <div>
          <label>Género:</label>
          <input type="text" name="genero" value={formData.genero} onChange={handleInputChange} />
          {errors.genero && <p className="text-danger">{errors.genero}</p>}
        </div>

        <div>
          <label>RUT:</label>
          <input type="text" name="rut" value={formData.rut} onChange={handleInputChange} />
          {errors.rut && <p className="text-danger">{errors.rut}</p>}
        </div>

        <div>
          <label>Fecha de Nacimiento:</label>
          <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} />
          {errors.fechaNacimiento && <p className="text-danger">{errors.fechaNacimiento}</p>}
        </div>

        <div>
          <label>Contraseña:</label>
          <input type="password" name="contrasena" value={formData.contrasena} onChange={handleInputChange} />
          {errors.contrasena && <p className="text-danger">{errors.contrasena}</p>}
        </div>

        <div>
          <label>Confirmar Contraseña:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
          {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
};

export default UserCreationForm;

