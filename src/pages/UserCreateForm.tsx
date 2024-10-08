import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../UserCreationForm.css';

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
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Limpiar el mensaje de error del campo modificado
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', 
    }));
  
    if (name === 'password' || name === 'confirmPassword') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: '', 
      }));
    }
  };

  const validate = () => {
    let newErrors = { username: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Validación de nombre de usuario
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es requerido';
      isValid = false;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
      isValid = false;
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    // Confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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

      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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