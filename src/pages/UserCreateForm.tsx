import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserCreationForm.css';
import { validateEmail, validatePassword } from '../utils/validators';
import { Form, Button, Card, Container } from 'react-bootstrap';

interface CreateUserDTO {
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  email: string;
  contrasena: string;
  telefono: string;
  genero: string;
  rut: string;
  fechaNacimiento: string;
  tipoUsuarioId: number;
}

type UserCreationFormProps = {
  onUserCreated?: () => void;
  isAdmin: boolean;
};

const UserCreationForm: React.FC<UserCreationFormProps> = ({ onUserCreated, isAdmin }) => {
  const [formData, setFormData] = useState<CreateUserDTO>({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: '',
    contrasena: '',
    telefono: '',
    genero: '',
    rut: '',
    fechaNacimiento: '',
    tipoUsuarioId: isAdmin ? 1 : 3,
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: '',
    contrasena: '',
    telefono: '',
    genero: '',
    rut: '',
    fechaNacimiento: '',
    tipoUsuarioId: '',
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
      telefono: /^[0-9]+$/.test(formData.telefono) ? '' : 'El teléfono solo debe contener números',
      genero: formData.genero ? '' : 'El género es obligatorio',
      rut: formData.rut ? '' : 'El RUT es obligatorio',
      fechaNacimiento: formData.fechaNacimiento ? '' : 'La fecha de nacimiento es obligatoria',
      tipoUsuarioId:
        isAdmin || formData.tipoUsuarioId === 3
          ? ''
          : 'El tipo de usuario debe estar entre 1 y 4',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const userData: CreateUserDTO = {
        ...formData,
        tipoUsuarioId: isAdmin ? formData.tipoUsuarioId : 3,
      };

      console.log('Datos enviados al backend:', userData);

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
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al crear el usuario');
        }

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
          tipoUsuarioId: isAdmin ? 1 : 3,
          contrasena: '',
        });

        if (onUserCreated) onUserCreated();
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error al crear el usuario: ${error.message}. Intente nuevamente.`);
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Hay errores en el formulario. Corrígelos antes de enviar.");
    }
  };

  return (
    <Container
    className="d-flex flex-column justify-content-center align-items-center vh-100"
    style={{ backgroundColor: '#f8f9fa' }}
  >
    <Card
      className="shadow-sm"
      style={{
        width: '600px',
        padding: '40px',
        borderRadius: '8px',
        border: '1px solid #C7CCC7',
        backgroundColor: '#FFF',
      }}
    >
      <Card.Body>
        <h2
          className="text-center mb-3"
          style={{
            color: '#264653',
            fontWeight: 'bold',
            fontSize: '1.8rem',
          }}
        >
          ¿Eres nuevo en Plant AI?
        </h2>
        <p
          className="text-center mb-4"
          style={{
            color: '#6C757D',
            fontSize: '1.1rem',
          }}
        >
          Regístrate y disfruta de nuestros productos y beneficios
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Nombre*"
              value={formData.nombre}
              onChange={handleInputChange}
              isInvalid={!!errors.nombre}
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="apellido">
            <Form.Control
              type="text"
              name="apellido"
              placeholder="Apellido*"
              value={formData.apellido}
              onChange={handleInputChange}
              isInvalid={!!errors.apellido}
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
            <Form.Control.Feedback type="invalid">{errors.apellido}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="rut">
            <Form.Control
              type="text"
              name="rut"
              placeholder="RUT*"
              value={formData.rut}
              onChange={handleInputChange}
              isInvalid={!!errors.rut}
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
            <Form.Control.Feedback type="invalid">{errors.rut}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="telefono">
            <Form.Control
              type="text"
              name="telefono"
              placeholder="Número de teléfono*"
              value={formData.telefono}
              onChange={handleInputChange}
              isInvalid={!!errors.telefono}
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
            <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Control
              type="email"
              name="email"
              placeholder="Correo electrónico *"
              value={formData.email}
              onChange={handleInputChange}
              isInvalid={!!errors.email}
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="contrasena">
            <Form.Control
              type="password"
              name="contrasena"
              placeholder="Contraseña*"
              value={formData.contrasena}
              onChange={handleInputChange}
              isInvalid={!!errors.contrasena}
              style={{
                borderRadius: '8px',
                height: '48px',
              }}
            />
            <Form.Control.Feedback type="invalid">{errors.contrasena}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="terms">
            <Form.Check
              type="checkbox"
              label="Acepto Términos y Condiciones"
              required
              style={{
                fontSize: '0.9rem',
                color: '#264653',
              }}
            />
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button
              variant="dark"
              type="submit"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '153px',
                height: '48px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#1A4756',
                border: 'none',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear cuenta'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  </Container>
);
  };

export default UserCreationForm;




