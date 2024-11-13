import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserCreationForm.css';
import { validateEmail, validatePassword } from '../utils/validators';

interface CreateUserDTO {
  name: string;
  password: string;
  email: string;
}

type UserCreationFormProps = {
  onUserCreated?: () => void;
};

const UserCreationForm: React.FC<UserCreationFormProps> = ({ onUserCreated }) => {
  const [formData, setFormData] = useState<CreateUserDTO>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validate = () => {
    const newErrors = {
      name: formData.name ? '' : 'El nombre es obligatorio',
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const userData: CreateUserDTO = {
        name: formData.name,
        password: formData.password,
        email: formData.email,
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
          name: '',
          email: '',
          password: '',
        });

        setErrors({
          name: '',
          email: '',
          password: '',
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
        <h2>Crear Usuario</h2>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="text-danger">{errors.name}</p>}
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
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="text-danger">{errors.password}</p>}
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
};

export default UserCreationForm;


