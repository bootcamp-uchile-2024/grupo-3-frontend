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
    className="user-creation-container"
    style={{
      display: 'flex',
      padding: '20px',
      background: '#fff',
    }}
  >
    <Form
      onSubmit={handleSubmit}
      className="user-creation-form"
      style={{
        width: '700px',
        padding: '0',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '10px',
          fontFamily: 'Quicksand, sans-serif',
          fontWeight: 700,
        }}
      >
        ¿Eres nuevo en Plant AI?
      </h2>
      <p
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#1A4756',
          fontWeight: 500,
        }}
      >
        Regístrate y disfruta de nuestros <br />
        productos y beneficios
      </p>

      <h3
        style={{
          marginBottom: '20px',
          fontWeight: 600,
          marginTop: '40px',
        }}
      >
        Mis datos:
      </h3>

      {/* Nombre y Apellido */}
      <Row className="mb-3">
      <Col md={6}>
          <Form.Group controlId="nombre">
            <Form.Label style={{ fontWeight: 'bold' }}>Nombre*</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              style={{
                borderRadius: '8px',
                background: '#F8FAFC',
                height: '35px',
              }}
            />
            {errors.nombre && (
              <Form.Text className="text-danger">{errors.nombre}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="apellido">
            <Form.Label style={{ fontWeight: 'bold' }}>Apellido*</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              style={{
                borderRadius: '8px',
                background: '#F8FAFC',
                height: '35px',
              }}
            />
            {errors.apellido && (
              <Form.Text className="text-danger">{errors.apellido}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Nombre de Usuario */}
      <Form.Group className="mb-3" controlId="nombreUsuario">
        <Form.Label style={{ fontWeight: 'bold' }}>Nombre de usuario*</Form.Label>
        <Form.Control
          type="text"
          name="nombreUsuario"
          placeholder="Nombre de Usuario"
          value={formData.nombreUsuario}
          onChange={handleInputChange}
          style={{
            borderRadius: '8px',
            background: '#F8FAFC',
            height: '35px',
          }}
        />
        {errors.nombreUsuario && (
          <Form.Text className="text-danger">{errors.nombreUsuario}</Form.Text>
        )}
      </Form.Group>

      {/* Correo */}
      <Form.Group className="mb-3" controlId="email">
        <Form.Label style={{ fontWeight: 'bold' }}>Correo*</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleInputChange}
          style={{
            borderRadius: '8px',
            background: '#F8FAFC',
            height: '35px',
          }}
        />
        {errors.email && (
          <Form.Text className="text-danger">{errors.email}</Form.Text>
        )}
      </Form.Group>

      {/* Contraseña */}
      <Form.Group className="mb-3" controlId="contrasena">
        <Form.Label style={{ fontWeight: 'bold' }}>Contraseña*</Form.Label>
        <Form.Control
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={formData.contrasena}
          onChange={handleInputChange}
          style={{
            borderRadius: '8px',
            background: '#F8FAFC',
            height: '35px',
          }}
        />
        {errors.contrasena && (
          <Form.Text className="text-danger">{errors.contrasena}</Form.Text>
        )}
      </Form.Group>

      {/* RUT y Teléfono */}
      <Row className="mb-3">
      <Col md={6}>
          <Form.Group controlId="rut">
            <Form.Label style={{ fontWeight: 'bold' }}>RUT*</Form.Label>
            <Form.Control
              type="text"
              name="rut"
              placeholder="RUT"
              value={formData.rut}
              onChange={handleInputChange}
              style={{
                borderRadius: '8px',
                background: '#F8FAFC',
                height: '35px',
              }}
            />
            {errors.rut && (
              <Form.Text className="text-danger">{errors.rut}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="telefono">
            <Form.Label style={{ fontWeight: 'bold' }}>Teléfono*</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
              style={{
                borderRadius: '8px',
                background: '#F8FAFC',
                height: '35px',
              }}
            />
            {errors.telefono && (
              <Form.Text className="text-danger">{errors.telefono}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Género */}
      <Form.Group className="mb-3" controlId="genero">
        <Form.Label style={{ fontWeight: 'bold'
         }}>Género:</Form.Label>
        <Form.Select
          name="genero"
          value={formData.genero}
          onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
          style={{
            borderRadius: '8px',
            background: '#F8FAFC',
            height: '40px',
            textAlign: 'center'
          }}
          
        >
          <option value="" disabled>
            Género 
          </option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
          
        </Form.Select>
        
        
        {errors.genero && (
          <Form.Text className="text-danger">{errors.genero}</Form.Text>
        )}
      </Form.Group>

      {/* Fecha de Nacimiento */}
<Form.Group className="mb-3" controlId="fechaNacimiento">
  <Form.Label style={{ fontWeight: 'bold' }}>Fecha de Nacimiento*</Form.Label>
  <Form.Control
    type="date"
    name="fechaNacimiento"
    value={formData.fechaNacimiento}
    onChange={handleInputChange}
    style={{
      width: '95%',
      height: '35px',
      padding: '10px',
      borderRadius: '8px',
      background: '#F8FAFC',
      color: '#555',
    }}
  />
  {errors.fechaNacimiento && (
    <Form.Text className="text-danger">{errors.fechaNacimiento}</Form.Text>
  )}
</Form.Group>

<h3
  style={{
    marginBottom: '20px',
    fontWeight: 600,
    marginTop: '50px',
  }}
>
  Información de Despacho:
</h3>

{/* Región */}
<Form.Group className="mb-3" controlId="region">
  <Form.Label style={{ fontWeight: 'bold', marginBottom: '5px' }}>
    Región
  </Form.Label>
  <Form.Select
    name="region"
    value={formData.region}
    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
    style={{
      width: '95%',
      height: '42px',
      padding: '10px',
      borderRadius: '8px',
      background: '#F8FAFC',
      border: '1px solid #CCC',
      appearance: 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      fontSize: '15px',
      color: '#555',
    }}
  >
    <option value="" disabled>
      Región
    </option>
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

      {/* Botón */}
      <div className="mt-3">
      <Button
        variant="outline-primary float-end"
        onClick={() => navigate("../pages/LoginForm.tsx")}
        className="mb-3"
        style={{
          width: "283px",
          height: "48px",
          borderRadius: "8px",
          border: "1px solid #1A4756",
          backgroundColor: "#fff",
          color: "#1A4756",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Volver
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
        style={{
          width: "283px",
          height: "48px",
          borderRadius: "8px",
          border: "1px solid #1A4756",
          backgroundColor: "#1A4756",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isSubmitting ? "Creando usuario..." : "Crear cuenta"}
      </Button>
    </div>

    </Form>
  </Container>
);


};

export default UserCreationForm;




