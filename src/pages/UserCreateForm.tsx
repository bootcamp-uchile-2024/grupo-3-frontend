import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserCreationForm.css';
import { validateEmail, validatePassword } from '../utils/validators';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

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
  region?: string;
}

type UserCreationFormProps = {
  onUserCreated?: () => void;
  isAdmin: boolean;
};

const UserCreationForm: React.FC<UserCreationFormProps> = ({ onUserCreated, isAdmin }) => {
  const navigate = useNavigate();

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
    region: ''
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
      tipoUsuarioId: isAdmin || formData.tipoUsuarioId === 3 ? '' : 'El tipo de usuario debe estar entre 1 y 4',
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
          region: ''
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
    <Container className="user-creation-container">
      <Form onSubmit={handleSubmit} className="user-creation-form">
        <h2 className="form-title">¿Eres nuevo en Plant AI?</h2>
        <p className="form-subtitle">
          Regístrate y disfruta de nuestros <br />
          productos y beneficios
        </p>

        <h3 className="section-title">Mis datos:</h3>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="nombre">
              <Form.Label className="form-label">Nombre*</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.nombre && (
                <Form.Text className="text-danger">{errors.nombre}</Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="apellido">
              <Form.Label className="form-label">Apellido*</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.apellido && (
                <Form.Text className="text-danger">{errors.apellido}</Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="nombreUsuario">
          <Form.Label className="form-label">Nombre de usuario*</Form.Label>
          <Form.Control
            type="text"
            name="nombreUsuario"
            placeholder="Nombre de Usuario"
            value={formData.nombreUsuario}
            onChange={handleInputChange}
            className="form-input"
          />
          {errors.nombreUsuario && (
            <Form.Text className="text-danger">{errors.nombreUsuario}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label className="form-label">Correo*</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
          />
          {errors.email && (
            <Form.Text className="text-danger">{errors.email}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="contrasena">
          <Form.Label className="form-label">Contraseña*</Form.Label>
          <Form.Control
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleInputChange}
            className="form-input"
          />
          {errors.contrasena && (
            <Form.Text className="text-danger">{errors.contrasena}</Form.Text>
          )}
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="rut">
              <Form.Label className="form-label">RUT*</Form.Label>
              <Form.Control
                type="text"
                name="rut"
                placeholder="RUT"
                value={formData.rut}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.rut && (
                <Form.Text className="text-danger">{errors.rut}</Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="telefono">
              <Form.Label className="form-label">Teléfono*</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.telefono && (
                <Form.Text className="text-danger">{errors.telefono}</Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="genero">
          <Form.Label className="form-label">Género*</Form.Label>
          <Form.Select
            name="genero"
            value={formData.genero}
            onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
            className="form-select"
          >
            <option value="" disabled>Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </Form.Select>
          {errors.genero && (
            <Form.Text className="text-danger">{errors.genero}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="fechaNacimiento">
          <Form.Label className="form-label">Fecha de Nacimiento*</Form.Label>
          <Form.Control
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            className="date-input"
          />
          {errors.fechaNacimiento && (
            <Form.Text className="text-danger">{errors.fechaNacimiento}</Form.Text>
          )}
        </Form.Group>

        <h3 className="section-title">Información de Despacho:</h3>

        <Form.Group className="mb-3" controlId="region">
          <Form.Label className="form-label">Región</Form.Label>
          <Form.Select
            name="region"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="region-select"
          >
            <option value="" disabled>Región</option>
            <option value="Arica y Parinacota">Arica y Parinacota</option>
            <option value="Tarapacá">Tarapacá</option>
            <option value="Antofagasta">Antofagasta</option>
            <option value="Atacama">Atacama</option>
            <option value="Coquimbo">Coquimbo</option>
            <option value="Valparaíso">Valparaíso</option>
            <option value="Metropolitana">Metropolitana</option>
            <option value="O'Higgins">O'Higgins</option>
            <option value="Maule">Maule</option>
            <option value="Ñuble">Ñuble</option>
            <option value="BioBio">BioBio</option>
            <option value="Araucanía">Araucanía</option>
            <option value="Los Ríos">Los Ríos</option>
            <option value="Los Lagos">Los Lagos</option>
            <option value="Aysén">Aysén</option>
            <option value="Magallanes">Magallanes</option>
            <option value="Antártida">Antártida Chilena</option>
          </Form.Select>
        </Form.Group>

        <h3 className="section-title">Registra una tarjeta (Opcional)</h3>

        <Form.Group className="mb-3">
          <Form.Label className="form-label">Número de tarjeta</Form.Label>
          <Form.Control
            type="number"
            name="numeroTarjeta"
            placeholder="Número de tarjeta"
            className="card-input"
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="experacion">
              <Form.Label className="form-label">Expiración (MM/YY)</Form.Label>
              <Form.Control
                type="number"
                name="experacion"
                placeholder="Expiración (MM/YY)"
                className="card-input"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="cvc">
              <Form.Label className="form-label">CVC</Form.Label>
              <Form.Control
                type="number"
                name="cvc"
                placeholder="CVC"
                className="card-input"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="button-container">
          <Button
            variant="outline-primary"
            onClick={() => navigate("/login")}
            className="btn-back"
          >
            Volver
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn-create"
          >
            {isSubmitting ? "Creando usuario..." : "Crear cuenta"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UserCreationForm;