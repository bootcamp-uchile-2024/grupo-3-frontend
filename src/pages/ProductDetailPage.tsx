import '../styles/ProductDetailStyle.css';
import '../styles/Offcanvas.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice';
import { Button, Card, Col, Container, Row, Form, Offcanvas } from 'react-bootstrap';
import { CartPlus, CaretDown } from 'react-bootstrap-icons';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<productsCatalog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isShipping, setIsShipping] = useState<boolean>(false);
  const [isPickup, setIsPickup] = useState<boolean>(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (!id) return;

        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/productos/${id}`);
        if (!response.ok) {
          throw new Error('No pudimos obtener el producto');
        }
        const productJson = await response.json();
        setProduct(productJson);

        if (productJson.imagenes && productJson.imagenes.length > 0) {
          setSelectedImage(productJson.imagenes[0].ruta);
        } else {
          setSelectedImage('/estaticos/default-image.jpg'); 
        }
      } catch (error) {
        setError('Hubo un error al obtener el producto');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <img src="https://i.gifer.com/4V0b.gif" alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  const handleAddToCart = (product: productsCatalog) => {
    if (quantity > product.stock) {
      alert(`Solo hay ${product.stock} unidades disponibles.`);
      return;
    }

    dispatch(addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: selectedImage || '/estaticos/default-image.jpg',
      descripcion: product.descripcion,
      cantidad: quantity,
      unidadesVendidas: product.unidadesVendidas,
      puntuacion: product.puntuacion,
      ancho: product.ancho,
      alto: product.alto,
      largo: product.largo,
      peso: product.peso,
    }));
    setShowOffcanvas(true);
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 0)) {
      setQuantity(prevQuantity => prevQuantity + 1);
    } else {
      alert(`Solo hay ${product?.stock} unidades disponibles.`);
    }
  };

  const decrementQuantity = () => quantity > 1 && setQuantity(prevQuantity => prevQuantity - 1);

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
    setOpenSection(prev => (prev === section ? null : section));
  };

  const handleSelectImage = (image: string) => setSelectedImage(image);

  return (
    <div className='contenedorsupremo'>
      <Container className="mt-5 mb-5 pt-5">
        {product && (
          <Row>
            <Col md={6}>
              <Row>
                <Col md={10}>
                  <Card.Img
                    variant="top"
                    src={selectedImage}
                    alt={product.nombre}
                    className="rounded img-fluid"
                  />
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                  <span className="material-symbols-outlined">
                    arrow_forward_ios
                  </span>
                </Col>
              </Row>
              <Row className="mt-5">
                <div className="image-thumbnails d-flex flex-wrap gap-3">
                  {product.imagenes && product.imagenes.length > 0 ? (
                    product.imagenes.map((img, index) => (
                      <Col key={index} xs={3} sm={2}>
                        <img
                          src={img.ruta}
                          alt={`${product.nombre} - Imagen ${index + 1}`}
                          className={`thumbnail-img rounded img-fluid ${selectedImage === img.ruta ? 'selected-thumbnail' : ''}`}
                          onClick={() => handleSelectImage(img.ruta)}
                          style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
                        />
                      </Col>
                    ))
                  ) : (
                    <Col xs={3} sm={2}>
                      <img
                        src="/estaticos/default-image.jpg"
                        alt="Imagen por defecto"
                        className="thumbnail-img rounded img-fluid"
                        onClick={() => setSelectedImage('/estaticos/default-image.jpg')}
                        style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
                      />
                    </Col>
                  )}
                </div>
              </Row>
            </Col>
            <Col md={6}>
              <Card.Body>
                <Card.Title className="product-title">{product.nombre}</Card.Title>
                <Card.Text className="product-description">
                  {product.descripcion}
                  <p className='ref'>*Fotos De Carácter Referencial</p>
                </Card.Text>
                <Card.Text>
                  <span className="product-price">
                    <div>
                      <span>Ahora </span>
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0,
                      }).format(product.precio)}
                    </div>
                  </span>
                  <span className='product-details p'>
                    <div>
                      <span>Normal </span>
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0,
                      }).format(product.precio)}
                    </div>
                  </span>
                </Card.Text>

                {/* Controles de cantidad */}
                <div className="d-flex align-items-center mb-3 mt-4 quantity-controls">
                  <span>Cantidad</span>
                  <Button onClick={decrementQuantity} className="btn-circle">-</Button>
                  <span className="mx-2">{quantity}</span>
                  <Button onClick={incrementQuantity} className="btn-circle">+</Button>
                </div>

                {/* Botones de acción */}
                <div className="d-flex gap-3 mt-3">
                  <Button className="btn-action" onClick={() => handleAddToCart(product)}>
                    Añadir a Carrito <CartPlus className="ms-2" size={18} />
                  </Button>
                  <Button variant="outline-primary" className="btn-action" onClick={handleBuyNow}>
                    Comprar Ahora
                  </Button>
                </div>

                {/* Tipo de entrega */}
                <div className="mt-4">
                  <a> ¿Qué tipo de entrega deseas?</a>
                  <Row className="textcolorinput">
                    <Col md={12} className="d-flex justify-content-start align-items-center mt-1">
                      <Form.Check
                        type="checkbox"
                        id="envio-a-domicilio"
                        label="Envío a Domicilio"
                        checked={isShipping}
                        onChange={() => setIsShipping(!isShipping)}
                      />
                    </Col>
                    <Col md={12} className="d-flex justify-content-start align-items-center">
                      <Form.Check
                        type="checkbox"
                        id="retiro-en-tienda"
                        label="Retiro en Tienda"
                        checked={isPickup}
                        onChange={() => setIsPickup(!isPickup)}
                      />
                    </Col>
                  </Row>
                  <Col className="d-flex">
                    <Button variant="outline-primary" className="btn-action" onClick={handleViewAvailability}>
                      Ver disponibilidad
                    </Button>
                  </Col>
                </div>

                {/* Características del producto */}
                <Card.Text className="product-details mt-3" id="product-icons">
                  <p id="textcolorinput">Características:</p>
                  <Row className="g-0 mt-2">
                    {/* Columna de iconos */}
                    <Col md={1} className="d-flex flex-column align-items-center gap-2">
                      <span className="material-symbols-outlined">potted_plant</span>
                      <span className="material-symbols-outlined">wb_sunny</span>
                      <span className="material-symbols-outlined">opacity</span>
                      <span className="material-symbols-outlined">device_thermostat</span>
                    </Col>

                    {/* Columna de características del producto */}
                    <Col md={11} className="p-0">
                      <p>Especie: {product?.planta?.especie || 'No especificado'}</p>
                      <p>Luz: {product?.planta?.fotoPeriodo || 'No especificado'}</p>
                      <p>Riego: {product?.planta?.tipoRiego || 'No especificado'}</p>
                      <p>Temperatura: {product?.planta?.toleranciaTemperatura || 'No especificado'}°C</p>
                    </Col>
                  </Row>
                </Card.Text>

              </Card.Body>
            </Col>

          </Row>
        )
        }

        <Row className="mt-4">
          {['descripcion', 'dimensiones', 'recomendaciones', 'garantias'].map((section) => (
            <Col md={3} key={section}>
              <Button
                variant="outline-secondary"
                onClick={() => toggleSection(section)}
                className="d-flex justify-content-between align-items-center w-100"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                <CaretDown size={18} className={`ms-2 ${openSection === section ? 'rotate-180' : ''}`} />
              </Button>
              {openSection === section && (
                <div className="mt-2">
                  {section === 'descripcion' && product?.descripcion}
                  {section === 'dimensiones' && (
                    <>
                      Ancho: {product?.ancho} cm<br />
                      Alto: {product?.alto} cm<br />
                      Largo: {product?.largo} cm
                    </>
                  )}
                  {section === 'recomendaciones' && 'La planta es apta para exteriores, es resistente a altas temperaturas.'}
                  {section === 'garantias' && 'Garantía de 1 año contra defectos de fabricación.'}
                </div>
              )}
            </Col>
          ))}
        </Row>
        <Offcanvas 
          show={showOffcanvas} 
          onHide={() => setShowOffcanvas(false)} 
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Mi Carrito de compras</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {product && (
              <div className="cart-item-card">
                <img 
                  src={selectedImage || '/estaticos/default-image.jpg'} 
                  alt={product.nombre}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h5>{product.nombre}</h5>
                  <div className="cart-item-price">
                    Ahora ${product.precio.toLocaleString('es-CL')}
                    <span className="cart-item-discount">35%</span>
                  </div>
                  <div className="cart-item-original-price">
                    Normal ${(product.precio * 1.35).toLocaleString('es-CL')}
                  </div>
                  <div className="cart-quantity-controls">
                    <button className="btn-circle">-</button>
                    <span>{quantity}</span>
                    <button className="btn-circle">+</button>
                  </div>
                </div>
                <button className="delete-button">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
            
            <div className="cart-total">
              <div className="d-flex justify-content-between">
                <span>Total a pagar:</span>
                <span>${(product?.precio || 0).toLocaleString('es-CL')}</span>
              </div>
            </div>
          </Offcanvas.Body>
          <div className="offcanvas-footer">
            <button 
              className="btn-go-to-cart"
              onClick={() => navigate('/cart')}
            >
              Ir al carrito de compras
            </button>
            <button 
              className="btn-continue-shopping"
              onClick={() => setShowOffcanvas(false)}
            >
              Sigue comprando
            </button>
          </div>
        </Offcanvas>
      </Container >
    </div>
  );
}