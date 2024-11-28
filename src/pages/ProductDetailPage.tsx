import '../styles/ProductDetailStyle.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice';
import { Button, Card, Col, Container, Row, Form } from 'react-bootstrap';
import { CartPlus, CaretDown } from 'react-bootstrap-icons';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<productsCatalog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isShipping, setIsShipping] = useState<boolean>(false);  // State for "Envío a Domicilio"
  const [isPickup, setIsPickup] = useState<boolean>(false);      // State for "Retiro en Tienda"
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteProduct = async (productId: number) => {
    const confirmation = window.confirm(`¿Estás seguro de querer eliminar el producto ${productId}?`);

    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:8080/productos/${productId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
        alert(`Eliminaste exitosamente el producto: ${productId}`);
        navigate('/catalogo');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        setError('Hubo un error al eliminar el producto');
      }
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (!id) return;

        const response = await fetch(`http://localhost:8080/productos/${id}`);
        if (!response.ok) {
          throw new Error('No pudimos obtener el producto');
        }
        const productJson = await response.json();
        setProduct(productJson);
      } catch (error) {
        setError('Hubo un error al obtener el producto');
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>{error}</div>;

  const handleAddToCart = (product: productsCatalog) => {
    dispatch(addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      descripcion: product.descripcion,
      cantidad: quantity,
      unidadesVendidas: product.unidadesVendidas,
      puntuacion: product.puntuacion,
      ancho: product.ancho,
      alto: product.alto,
      largo: product.largo,
      peso: product.peso,
    }));
  };

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      handleAddToCart(product);
      navigate('/cart');
    }
  };

  const handleViewAvailability = () => {
    alert('Verificando disponibilidad para la selección de envío/retirada.');
  };


  const toggleSection = (section: string) => {
    setOpenSection(prev => (prev === section ? null : section));  // Si la sección ya está abierta, se cierra
  };


  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <>
    <Container className="mt-4">
      {product && (
        <Row>
          <Col md={6}>
            <Card.Img
              variant="top"
              src={`https://placehold.co/454x608?text=${encodeURIComponent(product.nombre)}&font=roboto`}
              alt={product.nombre}
              className="rounded"
            />
            <Col className="mt-4">

              <div className="image-thumbnails d-flex justify-content-start gap-5">
                {[1, 2, 3, 4].map((index) => (
                  <img
                    key={index}
                    src={`https://placehold.co/94x128?text=Imagen+${index}`}
                    alt={`Imagen ${index}`}
                    className="thumbnail-img rounded"
                    onClick={() => handleSelectImage(`https://placehold.co/600x800?text=Imagen+${index}`)}
                  />
                ))}
              </div>

            </Col>
          </Col>

          <Col md={6}>
            <Card.Body>
              <div>
                <Card.Title className="product-title">{product.nombre}</Card.Title>
                <Card.Text className="product-description">
                  <strong>Descripción:</strong> {product.descripcion}
                  <p>*Fotos de carácter referencial</p>
                </Card.Text>
                <Card.Text className="product-price">
                  <strong>Precio:</strong> ${product.precio}
                </Card.Text>
              </div>

              <div className="d-flex align-items-center mb-3 quantity-controls">
                <span>Cantidad </span>

                <Button
                  className="btn-primary small rounded-circle"
                  onClick={decrementQuantity}
                  style={{ width: '24px', height: '24px', padding: '0' }}
                >
                  -
                </Button>

                <span className="mx-2">{quantity}</span>

                <Button
                  className="btn-primary small rounded-circle"
                  onClick={incrementQuantity}
                  style={{ width: '24px', height: '24px', padding: '0' }}
                >
                  +
                </Button>
              </div>

              <div className="d-flex gap-3 mt-3">
                <Button className="btn-action" onClick={() => handleAddToCart(product)}>
                  Añadir a Carrito <CartPlus className="ms-2" size={18} />
                </Button>
                <Button variant="outline-primary" className="btn-action" onClick={handleBuyNow}>
                  Comprar Ahora
                </Button>
              </div>

              {/* Nueva sección de "Ver disponibilidad" con checkboxes */}
              <div className="mt-4">
                <div className="d-flex justify-content-start align-items-center">
                  <div className="me-3">
                    <Form.Check
                      type="checkbox"
                      id="envio-a-domicilio"
                      label="Envío A Domicilio"
                      checked={isShipping}
                      onChange={() => setIsShipping(!isShipping)}
                    />
                    <Form.Check
                      type="checkbox"
                      id="retiro-en-tienda"
                      label="Retiro en Tienda"
                      checked={isPickup}
                      onChange={() => setIsPickup(!isPickup)}
                    />
                  </div>

                  <Button
                    variant="outline-primary"
                    className="btn-action"
                    onClick={handleViewAvailability}
                  >
                    Ver disponibilidad
                  </Button>
                </div>
              </div>

              <Card.Text className="product-details mt-3">
                <strong>Características:</strong>
                <p>Especie: {product?.planta?.especie || 'No especificado'}</p>
                <p>Luz: {product?.planta?.fotoPeriodo || 'No especificado'}</p>
                <p>Riego: {product?.planta?.tipoRiego || 'No especificado'}</p>
                <p>Temperatura: {product?.planta?.toleranciaTemperatura || 'No especificado'}°C</p>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      )}

      <Row className="mt-4">
        <Col md={3}>
          <Button
            variant="outline-secondary"
            onClick={() => toggleSection('descripcion')}
            className="d-flex justify-content-between align-items-center w-100"
          >
            Descripción
            <CaretDown size={18} className={`ms-2 ${openSection === 'descripcion' ? 'rotate-180' : ''}`} />
          </Button>
          {openSection === 'descripcion' && (
            <div className="mt-2">
              {product?.descripcion}
            </div>
          )}
        </Col>
        <Col md={3}>
          <Button
            variant="outline-secondary"
            onClick={() => toggleSection('dimensiones')}
            className="d-flex justify-content-between align-items-center w-100"
          >
            Dimensiones
            <CaretDown size={18} className={`ms-2 ${openSection === 'dimensiones' ? 'rotate-180' : ''}`} />
          </Button>
          {openSection === 'dimensiones' && (
            <div className="mt-2">
              Ancho: {product?.ancho} cm<br />
              Alto: {product?.alto} cm<br />
              Largo: {product?.largo} cm
            </div>
          )}
        </Col>
        <Col md={3}>
          <Button
            variant="outline-secondary"
            onClick={() => toggleSection('recomendaciones')}
            className="d-flex justify-content-between align-items-center w-100"
          >
            Recomendaciones
            <CaretDown size={18} className={`ms-2 ${openSection === 'recomendaciones' ? 'rotate-180' : ''}`} />
          </Button>
          {openSection === 'recomendaciones' && (
            <div className="mt-2">
              La planta es apta para exteriores, es resistente a altas temperaturas.
            </div>
          )}
        </Col>
        <Col md={3}>
          <Button
            variant="outline-secondary"
            onClick={() => toggleSection('garantias')}
            className="d-flex justify-content-between align-items-center w-100"
          >
            Garantías
            <CaretDown size={18} className={`ms-2 ${openSection === 'garantias' ? 'rotate-180' : ''}`} />
          </Button>
          {openSection === 'garantias' && (
            <div className="mt-2">
              Garantía de 1 año contra defectos de fabricación.
            </div>
          )}
        </Col>
      </Row>
      <br />

    </Container>
    </>
  );
};