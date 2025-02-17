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
  idRol: number;
}

type UserCreationFormProps = {
  onUserCreated?: () => void;
  isAdmin: boolean;
};

const UserCreationForm: React.FC<UserCreationFormProps> = ({ onUserCreated, isAdmin = false }) => {
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
    idRol: 3, // Rol predeterminado para clientes
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
    idRol: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {
      nombre: formData.nombre ? '' : 'El nombre es obligatorio',
      apellido: formData.apellido ? '' : 'El apellido es obligatorio',
      nombreUsuario: formData.nombreUsuario ? '' : 'El nombre de usuario es obligatorio',
      email: validateEmail(formData.email) || '',
      contrasena: validatePassword(formData.contrasena) || '',
      confirmPassword: formData.contrasena === confirmPassword ? '' : 'Las contraseñas no coinciden',
      telefono: /^[0-9]+$/.test(formData.telefono) ? '' : 'El teléfono solo debe contener números',
      genero: formData.genero ? '' : 'El género es obligatorio',
      rut: formData.rut ? '' : 'El RUT es obligatorio',
      fechaNacimiento: formData.fechaNacimiento ? '' : 'La fecha de nacimiento es obligatoria',
      idRol: isAdmin || formData.idRol === 3 ? '' : 'Solo un administrador puede asignar roles diferentes de Cliente',
    };

    console.log('Errores detectados:', newErrors);
    setErrors(newErrors);

    if (!acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return false;
    }

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const userData: CreateUserDTO = {
        ...formData,
        idRol: isAdmin ? formData.idRol : 3, 
      };

      console.log('Datos enviados al servidor:', userData);
      setIsSubmitting(true);

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

        const response = await fetch(`${API_BASE_URL}/auth/registro`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const responseData = await response.json();
          console.error('Error al crear usuario:', responseData.message);
          alert(`Error al crear el usuario: ${responseData.message}`);
          return;
        }

        const responseData = await response.json();
        console.log('Usuario creado exitosamente:', responseData);

        alert('¡Usuario creado exitosamente!');
        setFormData({
          nombre: '',
          apellido: '',
          nombreUsuario: '',
          email: '',
          contrasena: '',
          telefono: '',
          genero: '',
          rut: '',
          fechaNacimiento: '',
          idRol: 3,
        });
        setConfirmPassword('');
        setAcceptTerms(false);

        if (responseData.carritoActivo) {
          console.log('Carrito activo asignado:', responseData.carritoActivo);
          localStorage.setItem('cartId', responseData.carritoActivo.id);
        }

        if (onUserCreated) onUserCreated();
        else navigate('/login'); 
      } catch (error) {
        console.error('Error crítico al crear usuario:', error);
        alert('Hubo un problema al crear tu cuenta. Por favor, intenta nuevamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Container className="user-creation-container col-md-12">
      <Form onSubmit={handleSubmit}>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="required-field">Nombre</Form.Label>
              <Form.Control
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-control-custom"
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="required-field">Apellido</Form.Label>
              <Form.Control
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="form-control-custom"
                isInvalid={!!errors.apellido}
              />
              <Form.Control.Feedback type="invalid">{errors.apellido}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
          <Form.Label className="required-field">Nombre usuario</Form.Label>
          <Form.Control
            name="nombreUsuario"
            placeholder="Nombre de usuario"
            value={formData.nombreUsuario}
            onChange={handleInputChange}
            className="form-control-custom"
            isInvalid={!!errors.nombreUsuario}
          />
          <Form.Control.Feedback type="invalid">{errors.nombreUsuario}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label className="required-field">Correo</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleInputChange}
            className="form-control-custom"
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label className="required-field">Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleInputChange}
            className="form-control-custom"
            isInvalid={!!errors.contrasena}
          />
          <Form.Control.Feedback type="invalid">{errors.contrasena}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label className="required-field">Confirmar contraseña</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña"
            className="form-control-custom"
            isInvalid={!!errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="required-field">RUT</Form.Label>
              <Form.Control
                name="rut"
                placeholder="RUT"
                value={formData.rut}
                onChange={handleInputChange}
                className="form-control-custom"
                isInvalid={!!errors.rut}
              />
              <Form.Control.Feedback type="invalid">{errors.rut}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="required-field">Teléfono</Form.Label>
              <Form.Control
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="form-control-custom"
                isInvalid={!!errors.telefono}
              />
              <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
          <Form.Label className="required-field">Fecha nacimiento</Form.Label>
          <Form.Control
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            className="form-control-custom"
            isInvalid={!!errors.fechaNacimiento}
          />
          <Form.Control.Feedback type="invalid">{errors.fechaNacimiento}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label className="required-field">Género</Form.Label>
          <Form.Select
            name="genero"
            value={formData.genero}
            onChange={handleSelectChange}
            className="form-select-custom"
            isInvalid={!!errors.genero}
          >
            <option value="">Selecciona un género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.genero}</Form.Control.Feedback>
        </Form.Group>

        {isAdmin && (
          <Form.Group>
            <Form.Label>Tipo de Usuario</Form.Label>
            <Form.Select
              name="idRol"
              value={formData.idRol}
              onChange={handleSelectChange}
              className="form-select-custom"
              isInvalid={!!errors.idRol}
            >
              <option value="">Selecciona un rol</option>
              <option value="1">Super Admin</option>
              <option value="2">Admin</option>
              <option value="3">Cliente</option>
              <option value="4">Visitante</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.idRol}</Form.Control.Feedback>
          </Form.Group>
        )}

        <Form.Group>
          <Form.Check
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            label="Acepto Términos y Condiciones"
          />
        </Form.Group>

        <div className="button-container">
          <Button
            className="btn-outline-primary"
            onClick={() => navigate(-1)}
            style={{ color: '#1A4756'}}
            type="button"
          >
            Volver
          </Button>
          <Button
            className="btn-create"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UserCreationForm;

