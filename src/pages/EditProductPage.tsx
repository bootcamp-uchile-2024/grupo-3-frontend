import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditProductAdmin } from '../interfaces/ProductAdmin';
import { Button, Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap';
import UserGreeting from '../components/UserGreeting';
import AdminSideBar from '../components/AdminSideBar';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<EditProductAdmin>({
    SKU: "",
    nombre: "",
    idCategoria: 0,
    precio: 0,
    descripcion: "",
    stock: 0,
    unidadesVendidas: 0,
    puntuacion: 0,
    ancho: 0,
    alto: 0,
    largo: 0,
    peso: 0,
    imagenes: [{ id_producto: 0, ruta: "" }],
    habilitado: false,
    planta: undefined,
    macetero: undefined,
    accesorio: undefined,
    insumo: undefined,
  });
  const [image, setImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const backendUrl = import.meta.env.VITE_URL_ENDPOINT_BACKEND;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${backendUrl}/productos/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Error al obtener los detalles del producto');
        const data = await response.json();
        setProduct(data);
        setImage(data.imagenes.length > 0 ? data.imagenes[0].ruta : "");
      } catch (err) {
        setError('No se pudo cargar el producto. Por favor, intenta de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!product.nombre) {
      newErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else if (product.nombre.length > 60) {
      newErrors.nombre = 'El nombre no puede ser mayor a 60 caracteres';
      isValid = false;
    }

    if (product.precio <= 100) {
      newErrors.precio = 'El precio debe ser mayor que $100';
      isValid = false;
    }

    if (!product.descripcion) {
      newErrors.descripcion = 'La descripción es requerida';
      isValid = false;
    } else if (product.descripcion.length > 150) {
      newErrors.descripcion = 'La descripción no puede ser mayor a 150 caracteres';
      isValid = false;
    }
    if (!product.idCategoria) {
      newErrors.idCategoria = 'Debe seleccionar una categoría';
      isValid = false;
    }

    if (product.stock <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor que 0';
      isValid = false;
    }

    if (!product.ancho || !product.alto || !product.largo) {
      newErrors.dimensiones = 'Complete todas las dimensiones';
      isValid = false;
    }

    if (!product.peso) {
      newErrors.peso = 'Complete el peso';
      isValid = false;
    }

    setErrores(newErrors);
    return isValid;
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!validate()) return;

    try {
      const response = await fetch(`${backendUrl}/productos/${id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }
      alert('Producto actualizado exitosamente');
      navigate(`/catalogo/producto/${id}`);
    } catch (err) {
      setError('Hubo un error al actualizar el producto');
      console.error(err);
    }
  };

  const handleImageDelete = async (imageIndex: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/productos/deleteProductImage/${id}/${imageIndex}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la imagen');
      }
      setProduct(prevProduct => ({
        ...prevProduct,
        imagenes: prevProduct.imagenes.filter((_, index) => index !== imageIndex)
      }));
      alert('Imagen eliminada exitosamente');
    } catch (error) {
      setError('Hubo un error al eliminar la imagen');
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/productos/addProductImage/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ base64Content: image }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la imagen');
      }
      const imageUrl = await response.text();
      console.log('Nueva imagen subida:', imageUrl);
      setProduct(prevProduct => ({
        ...prevProduct,
        imagenes: [...prevProduct.imagenes, { id_producto: 0, ruta: imageUrl }],
      }));
      setImage("");
      setImagePreview(null);

      alert('Imagen actualizada exitosamente');
    } catch (err) {
      setError('Hubo un error al actualizar la imagen');
      console.error(err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };


  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>{error}</p>;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col xs={12}>
          <UserGreeting />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={3}>
          <AdminSideBar />
        </Col>
        <Col xs={12} md={9}>
          <div className="product-management-container">
            <Tabs defaultActiveKey="productos" className="custom-tabs mb-3">
              <Tab eventKey="productos" title="Editar Producto">
                <Form onSubmit={handleProductSubmit}>
                  <h2>Producto {product.SKU}</h2>
                  <br />
                  <Row>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <Form.Group controlId="nombre">
                        <Form.Label>Nombre del producto</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={product.nombre}
                          onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
                          placeholder="Ingrese Nombre"
                        />
                        {errores.nombre && <p className="error">{errores.nombre}</p>}
                      </Form.Group>
                    </Col>

                    <Col xs={12} sm={6} md={4} lg={3}>
                      <Form.Group controlId="precio">
                        <Form.Label>Precio <a>{formatPrice(product.precio)}</a></Form.Label>
                        <Form.Control
                          type="number"
                          name="precio"
                          value={product.precio}
                          onChange={(e) => setProduct({ ...product, precio: Number(e.target.value) })}
                          min={0}
                        />
                        {errores.precio && <p className="error">{errores.precio}</p>}
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <Form.Group controlId="stock">
                        <Form.Label>Cantidad de Stock</Form.Label>
                        <Form.Control
                          type="number"
                          name="stock"
                          value={product.stock}
                          onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                          min={0}
                        />
                        {errores.cantidad && <p className="error">{errores.cantidad}</p>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} sm={12} md={12} lg={9}>
                      <Form.Group controlId="descripcion">
                        <Form.Label>Descripción del producto</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="descripcion"
                          value={product.descripcion}
                          onChange={(e) => setProduct({ ...product, descripcion: e.target.value })}
                          placeholder="Ingrese Descripción"
                          rows={5}
                        />
                        {errores.descripcion && <p className="error">{errores.descripcion}</p>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <Form.Group controlId="ancho">
                        <Form.Label>Ancho en cm.</Form.Label>
                        <Form.Control
                          type="number"
                          name="ancho"
                          value={product.ancho}
                          onChange={(e) => setProduct({ ...product, ancho: Number(e.target.value) })}
                          min={0}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <Form.Group controlId="alto">
                        <Form.Label>Alto en cm.</Form.Label>
                        <Form.Control
                          type="number"
                          name="alto"
                          value={product.alto}
                          onChange={(e) => setProduct({ ...product, alto: Number(e.target.value) })}
                          min={0}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <Form.Group controlId="largo">
                        <Form.Label>Largo en cm.</Form.Label>
                        <Form.Control
                          type="number"
                          name="largo"
                          value={product.largo}
                          onChange={(e) => setProduct({ ...product, largo: Number(e.target.value) })}
                          min={0}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <Form.Group controlId="peso">
                        <Form.Label>Peso en gr.</Form.Label>
                        <Form.Control
                          type="number"
                          name="peso"
                          value={product.peso}
                          onChange={(e) => setProduct({ ...product, peso: Number(e.target.value) })}
                          min={0}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="primary" type="submit" className="w-100">
                    Guardar Cambios
                  </Button>
                </Form>
              </Tab>

              <Tab eventKey="imagenes" title="Imágenes">
              <Form onSubmit={handleImageSubmit} className="mt-4">
                <h3>Imágenes de {product.nombre}:</h3>
                {product.imagenes && product.imagenes.length > 0 ? (
                  product.imagenes.map((img, index) => (
                    <div key={`${img.id_producto}-${index}`} className="mt-3">
                      <div className="image-container" style={{ position: 'relative' }}>
                        <img
                          src={`${backendUrl}${img.ruta}`}
                          alt={`Imagen ${index + 1}`}
                          style={{ width: '100%', maxWidth: '200px', height: 'auto' }}
                        />
                        <div
                          className="image-number"
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '5px',
                            borderRadius: '50%',
                            fontWeight: 'bold',
                            fontSize: '16px',
                          }}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => handleImageDelete(index)}
                        className="mt-2"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>No hay imágenes asociadas a este producto.</p>
                )}
                <Form.Group controlId="imagen">
                  <Form.Label>Subir Imagen (Formato JPG o PNG)</Form.Label>
                  <p>Previsualización:</p>
                  {imagePreview ? (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Previsualización"
                        style={{ width: '100%', maxWidth: '100px', height: 'auto' }}
                      />
                    </div>
                  ) : (
                    <span className="material-symbols-outlined">add_photo_alternate</span>
                  )}
                  <Form.Control
                    type="file"
                    name="imagen"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </Form.Group>
                <Button variant="secondary" type="submit" className="w-100">
                  Actualizar Imagen
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </div>
      </Col>
    </Row>
  </Container>
  );
};

export default EditProductPage;