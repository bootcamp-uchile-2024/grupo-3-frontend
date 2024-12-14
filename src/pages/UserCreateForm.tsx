import React, { useState, useEffect } from 'react';
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
  comuna?: string;
  direccion?: string;
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
    region: '',
    comuna: '',
    direccion: ''
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
    confirmPassword: ''
  });

  const [regiones] = useState([
    "Metropolitana",
    "Valparaíso",
    "O'Higgins",
    // ... otras regiones
  ]);

  const [comunas, setComunas] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (formData.region === "Metropolitana") {
      setComunas(["Maipú", "Santiago", "Providencia", "Las Condes"]);
    } else if (formData.region === "Valparaíso") {
      setComunas(["Viña del Mar", "Valparaíso", "Concón"]);
    }
    // ... lógica para otras regiones
  }, [formData.region]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
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
      tipoUsuarioId: isAdmin || formData.tipoUsuarioId === 3 ? '' : 'El tipo de usuario debe estar entre 1 y 4',
    };

    setErrors(newErrors);
    
    if (!acceptTerms) {
      alert("Debes aceptar los términos y condiciones");
      return false;
    }

    return Object.values(newErrors).every(error => !error);
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
          contrasena: '',
          telefono: '',
          genero: '',
          rut: '',
          fechaNacimiento: '',
          tipoUsuarioId: isAdmin ? 1 : 3,
          region: '',
          comuna: '',
          direccion: ''
        });
        setConfirmPassword('');
        setAcceptTerms(false);

        if (onUserCreated) onUserCreated();
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error al crear el usuario: ${error.message}. Intente nuevamente.`);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Container className="user-creation-container">
      <Form onSubmit={handleSubmit}>
        <h2 className="form-title">¿Eres nuevo en Plant AI?</h2>
        <p className="form-subtitle">
          Regístrate y disfruta de nuestros productos y beneficios
        </p>

        <h3 className="section-title">Mis datos</h3>
        
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
              <Form.Control.Feedback type="invalid">
                {errors.nombre}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors.apellido}
              </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.nombreUsuario}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.contrasena}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors.rut}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors.telefono}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
          <Form.Select 
            name="genero" 
            value={formData.genero}
            onChange={handleSelectChange}
            className="form-select-custom"
            isInvalid={!!errors.genero}
          >
            <option value="">Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.genero}
          </Form.Control.Feedback>
        </Form.Group>

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
          <Form.Control.Feedback type="invalid">
            {errors.fechaNacimiento}
          </Form.Control.Feedback>
        </Form.Group>

        <h3 className="section-title">Información de despacho</h3>
        
        <div className="address-selects">
          <Form.Select
            name="region"
            value={formData.region}
            onChange={handleSelectChange}
            className="form-select-custom"
          >
            <option value="">Región</option>
            {regiones.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </Form.Select>

          <Form.Select
            name="comuna"
            value={formData.comuna}
            onChange={handleSelectChange}
            className="form-select-custom"
            disabled={!formData.region}
          >
            <option value="">Comuna</option>
            {comunas.map(comuna => (
              <option key={comuna} value={comuna}>{comuna}</option>
            ))}
          </Form.Select>
        </div>

        <Form.Group>
          <Form.Label className="required-field">Dirección</Form.Label>
          <Form.Control
            name="direccion"
            placeholder="Dirección/Número/Piso"
            value={formData.direccion}
            onChange={handleInputChange}
            className="form-control-custom"
          />
        </Form.Group>

        <div className="terms-checkbox">
          <Form.Check
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            label="Acepto Términos y Condiciones"
          />
        </div>

        <div className="button-container">
          <Button 
            className="btn-primary-outline"
            onClick={() => navigate(-1)}
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