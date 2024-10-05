import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../UserCreationForm.css';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators'; 

interface CreateUserDTO {
  name: string;
  password: string;
  email: string;
}

const UserCreationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));

    if (name === 'password' || name === 'confirmPassword') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
    };

    setErrors(newErrors); 
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const userData: CreateUserDTO = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      };

      alert('¡Usuario creado exitosamente!');
      console.log('Usuario creado:', JSON.stringify(userData, null, 2));

      // Reiniciar los campos del formulario
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      // Limpiar errores al enviar exitosamente
      setErrors({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className="user-creation-container relative-top">
      <form onSubmit={handleSubmit} className="user-creation-form">
        <h2>Crear Usuario</h2>

        <div>
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            className='user-creation-form-input'
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            className='user-creation-form-input'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            className='user-creation-form-input'
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar contraseña:</label>
          <input
            className='user-creation-form-input'
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        <button className="btn btn-primary w-100" type="submit">Crear Usuario</button>
      </form>
    </div>
  );
};

export default UserCreationForm;

/*
error: PlantAI/grupo-3-frontend/src/pages/UserCreateForm.tsx
  45:9  error  'newErrors' is never reassigned. Use 'const' instead  prefer-const

El error indica que la variable newErrors se define pero nunca se reasigna, lo cual es una oportunidad para utilizar const en lugar de let.

Solucion: Se cambia a const la funcion validate ya que no se está reasignando newErrors en ningún punto.

*/