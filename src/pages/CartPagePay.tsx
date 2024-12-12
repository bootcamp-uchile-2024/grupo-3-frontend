import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, updateQuantity } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';
import { Button, Card, Col, Container, ListGroup, Row, Form } from 'react-bootstrap';
import '../styles/CartPage.css';
import {
  handleRemoveProductFromCart,
  replaceCartProducts,
  initializeCart
} from '../utils/cartHelpers';


const CartPagePay: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { formData, pedidoId } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const [coupon, setCoupon] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [purchasedItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const userId = 2;

  if (!formData || !pedidoId) {
    console.error('No se encontraron datos para la página de pago.');
    return <p>Error: No hay datos disponibles para finalizar el pago.</p>;
  }

  console.log('Datos recibidos en CartPagePay:', formData, pedidoId);

  const API_BASE_URL = import.meta.env.VITE_URL_ENDPOINT_BACKEND || 'http://localhost:8080';

  const addProductToCart = async (cartId: number, productId: number, quantity: number) => {
    try {
      console.log(`Intentando agregar producto ${productId} al carrito ${cartId} con cantidad ${quantity}`);
      const response = await fetch(`${API_BASE_URL}/carro-compras/addproducto/${cartId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ productoId: productId, cantidadProducto: quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del backend:', data);

        if (data.producto.cantidad < quantity) {
          alert(`No hay suficiente stock para este producto. Disponible: ${data.producto.cantidad}.`);
          return;
        }

        console.log('Producto agregado al carrito:', data);
      } else {
        const errorData = await response.json();
        console.error('Error en la respuesta del servidor:', errorData);
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error al agregar producto al carrito:', getErrorMessage(error));
      alert('Hubo un problema al agregar el producto al carrito. Inténtalo nuevamente.');
    }
  };

  useEffect(() => {
    const initCart = async () => {
      await initializeCart(userId, setCartId, dispatch);
    };
    initCart();
  }, [userId, dispatch, setCartId]);
  
  
  const handleApplyCoupon = () => {
    if (coupon === 'bootcamp2024') {
      setDiscount(0.1);
    } else {
      alert('Cupón inválido.');
      setDiscount(0);
    }
  };

  const handleIncrement = async (productId: number) => {
    if (!cartId) {
      alert('No se ha inicializado el carrito.');
      return;
    }

    const product = cartItems.find((item) => item.id === productId);
    if (product) {
      try {
        const newQuantity = product.cantidad + 1;

        await addProductToCart(cartId, productId, newQuantity);

        dispatch(updateQuantity({ id: productId, cantidad: 1 }));
      } catch (_error) {
        alert('Error al intentar incrementar el producto. Por favor, inténtalo nuevamente.');
      }
    }
  };

  const handleDecrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: -1 }));
  };

  const handleClearCart = async () => {
    if (!window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        return;
    }

    try {
        if (!cartId) {
            alert('No hay un carrito asociado para vaciar.');
            return;
        }

        console.log(`Vaciando carrito con ID ${cartId}`);

        const response = await fetch(`${API_BASE_URL}/carro-compras/replaceProductos/${cartId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productosCarro: [],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al vaciar el carrito:', errorData);
            alert(errorData.message || 'Hubo un problema al vaciar el carrito.');
            return;
        }

        dispatch(clearCart());
        localStorage.removeItem('__redux__cart__'); // Limpia el localStorage
        console.log('Estado actual del localStorage después de limpiar:', localStorage.getItem('__redux__cart__')); // Depuración

        alert('El carrito ha sido vaciado exitosamente.');
    } catch (error: unknown) {
        console.error('Error al intentar vaciar el carrito:', error);
        alert('Hubo un problema al vaciar el carrito. Por favor, inténtalo nuevamente.');
    }
};


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPurchaseCompleted(false);
  };

  const handleFinalizePurchase = async () => {
    if (!cartId || cartItems.length === 0) {
        console.warn('El carrito está vacío o no tiene un cartId válido.');
        alert('El carrito está vacío. No se puede finalizar la compra.');
        return;
    }

    setLoading(true);

    try {
        console.log('Sincronizando productos antes de finalizar la compra...');
        await replaceCartProducts(cartId, cartItems);

        const response = await fetch(`${API_BASE_URL}/pedidos/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fechaCreacion: new Date().toISOString().split('T')[0],
                idMedioPago: 1,
                idEstado: 1,
                idTipoDespacho: 1,
                receptor: 'Usuario invitado',
                fechaEntrega: new Date(new Date().setDate(new Date().getDate() + 3))
                    .toISOString()
                    .split('T')[0],
                direccionEnvio: {
                    comuna: 'Por definir',
                    calle: 'Por definir',
                    numero: '123',
                    departamento: 'N/A',
                    referencia: 'Sin referencia',
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al finalizar la compra:', errorData);
            alert(`Error al finalizar la compra: ${errorData.message || 'Error desconocido'}`);
            return;
        }

        const data = await response.json();
        console.log('Compra finalizada exitosamente:', data);

        // Limpia Redux y localStorage
        dispatch(clearCart());
        localStorage.removeItem('__redux__cart__');
        console.log('Carrito limpiado en Redux y localStorage.');

        navigate('/success-page');
    } catch (error) {
        console.error('Error crítico al finalizar la compra:', error);
        alert('Hubo un problema al finalizar la compra. Por favor, inténtalo nuevamente.');
    } finally {
        setLoading(false);
    }
    localStorage.removeItem('__redux__cart__');
    console.log('Estado actual del localStorage después de limpiar:', localStorage.getItem('__redux__cart__'));

};


  
  const groupedItems = cartItems.reduce((acc: CartItem[], item: CartItem) => {
    const existingItem = acc.find((i: CartItem) => i.id === item.id);
    if (existingItem) {
      existingItem.cantidad += item.cantidad;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  const total = groupedItems.reduce((acc: number, item: CartItem) => {
    return acc + item.precio * item.cantidad;
  }, 0);

  const discountedTotal = total * (1 - discount);

  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(discountedTotal);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Error inesperado.';
  };

  const handleNavigateToCheckout = (): void => {
    navigate('/success-page');
  };

  return (
    <Container className="cart-container">
      <Row>
        <Col md={6} className='mt-2'>
          <h4>Tu compra</h4>
          {groupedItems.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <>
              <ListGroup className="mb-4">
                {groupedItems.map((item: CartItem) => (
                  <ListGroup.Item key={item.id} className="cart-item">
                    <Row className="align-items-center row col-md-12">
                      <Col md={3}>
                        <img src={item.imagen || 'placeholder.jpg'} alt={item.nombre} className="product-image img-fluid" />
                      </Col>
                      <Col md={7}>
                        <h5 className="product-title mb-2">{item.nombre}</h5>
                        <p className="price-text mb-1">Ahora ${item.precio.toLocaleString('es-CL')}</p>
                        <p className="original-price text-muted">Normal ${item.precio}</p>
                        <div className="quantity-controls">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleDecrement(item.id)}
                            disabled={item.cantidad === 1}
                          >
                            -
                          </Button>
                          <span className="mx-3">{item.cantidad}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleIncrement(item.id)}
                          >
                            +
                          </Button>
                        </div>
                      </Col>
                      <Col md={1} className="">
                        <Button
                          variant="link"
                          className="text-danger"
                          onClick={() => handleRemoveProductFromCart(cartId, item.id, dispatch)}

                        >
                          Eliminar
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Col>

        <Col md={6} className='mt-5'>
          <Card className="summary-card">
            <Card.Body>
              <Card.Title>Resumen de mi compra</Card.Title>
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Costos de tus productos</span>
                  <span>${total}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Descuentos</span>
                  <span>-${(total * discount).toLocaleString('es-CL')}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Envío</span>
                  <span>$0</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between total-row">
                  <strong>Total</strong>
                  <strong>${formattedTotal}</strong>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Col md={6} className='mt-4'>
      <Card className="payment-card">
        <Card.Body>
          {/* Sección de código de descuento */}
          <div className="discount-section mb-4">
            <h6 className="mb-3">Código de descuento</h6>
            <Form.Control
              type="text"
              placeholder="Código de descuento"
              className="mb-2"
            />
            <Button 
              variant="dark" 
              className="w-100"
              style={{ backgroundColor: '#1A4756' }}
            >
              Aplicar
            </Button>
          </div>

          {/* Sección de método de pago */}
          <div className="payment-method-section">
            <h6 className="mb-3">Eligen como pagar</h6>
            
            {/* Tarjetas guardadas */}
            <div className="saved-cards mb-3">
              <p className="text-muted small mb-2">Tarjetas guardadas</p>
              <Form.Select className="mb-3">
                <option>Falabella **9999</option>
              </Form.Select>
            </div>

            {/* Billeteras digitales */}
            <div className="digital-wallets mb-4">
              <p className="text-muted small mb-2">Billeteras digitales</p>
              <div className="payment-methods">
                <img src="src/assets/webpay.png" alt="Webpay" className="payment-icon" />
                <img src="src/assets/visa.png" alt="Visa" className="payment-icon" />
                <img src="src/assets/mastercard.png" alt="Mastercard" className="payment-icon" />
                <img src="src/assets/paypal.png" alt="PayPal" className="payment-icon" />
                <img src="src/assets/transferencia-bancaria.png" alt="Transferencia" className="payment-icon" />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      </Col>
      <Row>
        <Col md={12} className="d-flex justify-content-between mt-4">
            <Col md={4}>
              <Button className='back-button float-start btn btn-primary' variant="outline-primary" onClick={handleClearCart}>
                Volver
              </Button>
            </Col>
            <Col md={5}>
              <Button className='bt go-button float-end' variant="primary" onClick={handleNavigateToCheckout}>
                Finalizar la compra
              </Button>
            </Col>
        </Col>
      </Row>
      {isModalOpen && (
        <div className="modal show" style={{ display: 'block' }} aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              {isPurchaseCompleted ? (
                // Vista de compra completada
                <>
                  <div className="modal-header">
                    <h5 className="modal-title">Tu compra ha sido finalizada con éxito</h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                  </div>
                  <div className="modal-body">
                    <p>¡Gracias por tu compra!</p>
                    <h6>Detalles del pedido:</h6>
                    <ul className="list-group">
                      {purchasedItems.map((item: CartItem) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <img
                              src={item.imagen || 'placeholder.jpg'}
                              alt={item.nombre}
                              className="product-image me-3"
                            />
                            <span>{item.nombre}</span>
                          </div>
                          <span>x {item.cantidad} - ${item.precio * item.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                    <p>El total de tu compra fue de: <h3>${formattedTotal}</h3></p>
                    <div className="modal-footer">
                      <button className="btn btn-primary w-100" onClick={handleCloseModal}>
                        Cerrar
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Vista de carrito/resumen de compra
                <>
                  <div className="modal-header">
                    <h5 className="modal-title">Mi Carrito de compras</h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                  </div>
                  <div className="modal-body">
                    <div className="list-group">
                      {groupedItems.map((item: CartItem) => (
                        <div key={item.id} className="list-group-item">
                          <img
                            src={item.imagen || 'placeholder.jpg'}
                            alt={item.nombre}
                            className="product-image"
                          />
                          <div className="product-details">
                            <h6>{item.nombre}</h6>
                            <p>Normal ${item.precio.toLocaleString('es-CL')}</p>
                            <div className="quantity-controls">
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleDecrement(item.id)}
                                disabled={item.cantidad === 1}
                              >-</Button>
                              <span>{item.cantidad}</span>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleIncrement(item.id)}
                              >+</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="coupon-section mb-3">
                      <span>Aplicar cupón de descuento?</span>
                      <div className="input-group">
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="Ingresa tu cupón"
                          className="form-control"
                        />
                        <button className="btn btn-secondary" onClick={handleApplyCoupon}>
                          Aplicar
                        </button>
                      </div>
                    </div>

                    <div className="total-section mt-3">
                      <strong>Total a pagar: ${formattedTotal}</strong>
                    </div>
                  </div>

                  <div className="modal-footer flex-column">
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={handleFinalizePurchase}
                      disabled={loading}
                    >
                      {loading ? 'Procesando...' : 'Finalizar compra'}
                    </Button>
                    <button
                      className="btn btn-link text-secondary w-100"
                      onClick={handleCloseModal}
                    >
                      Seguir comprando
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CartPagePay;



