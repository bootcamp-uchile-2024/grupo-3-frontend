import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateQuantity, addToCart } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';
import { Button, Card, Col, Container, ListGroup, Row, Form } from 'react-bootstrap';
import '../styles/CartPage.css';

import webpayIcon from '../assets/webpay.png';
import visaIcon from '../assets/visa.png';
import mastercardIcon from '../assets/mastercard.png';
import paypalIcon from '../assets/paypal.png';
import transferenciaIcon from '../assets/transferencia-bancaria.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


const CartPagePay: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, pedidoId } = location.state || {};

  const [cartId, setCartId] = useState<number | null>(null);
  const [coupon, setCoupon] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Debes iniciar sesión para acceder a esta página.');
      navigate('/login', { replace: true });
      setIsAuthenticated(false);
    }
  }, [token, navigate]);

  const fetchActiveCart = useCallback(async (): Promise<number | null> => {
    if (!token) {
      console.error('No se encontró el token. Redirigiendo al login.');
      navigate('/login', { replace: true });
      return null;
    }
  
    const userId = JSON.parse(atob(token.split('.')[1])).sub;
  
    try {
      const response = await fetch(`${API_BASE_URL}/carro-compras/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Carrito activo encontrado con ID:', data.id);
        return data.id;
      }
  
      if (response.status === 404) {
        return null;
      }
  
      throw new Error('Error desconocido al obtener el carrito activo del usuario.');
    } catch (error) {
      console.error('Error al buscar carrito activo del usuario:', error);
      return null;
    }
  }, [token, navigate]);
  

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const cartIdFromState = location.state?.cartId;
        const cartIdFromLocalStorage = parseInt(localStorage.getItem('cartId') || '0', 10);

        let activeCartId = cartIdFromState || cartIdFromLocalStorage;

        if (!activeCartId) {
          activeCartId = await fetchActiveCart();
        }

        if (activeCartId) {
          setCartId(activeCartId);
          localStorage.setItem('cartId', activeCartId.toString());

          const savedCartItems = JSON.parse(localStorage.getItem('__redux__cart__') || '{}');
          if (savedCartItems.productos?.length > 0) {
            dispatch(clearCart());
            savedCartItems.productos.forEach((item: CartItem) => dispatch(addToCart(item)));
          }
        } else {
          console.warn('No se encontró un carrito activo.');
        }
      } catch (error) {
        console.error('Error al inicializar el carrito:', error);
      }
    };

    if (isAuthenticated) {
      initializeCart();
    }
  }, [dispatch, location.state?.cartId, fetchActiveCart, isAuthenticated]);

  useEffect(() => {
    if (!formData || !pedidoId) {
      alert('No se encontraron datos para continuar con el proceso de pago.');
      navigate('/cart', { replace: true });
    }
  }, [formData, pedidoId, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const groupedItems = cartItems.reduce((acc: CartItem[], item: CartItem) => {
    const existingItem = acc.find((i: CartItem) => i.id === item.id);
    if (existingItem) {
      existingItem.cantidad += item.cantidad;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  const total = groupedItems.reduce((acc: number, item: CartItem) => acc + item.precio * item.cantidad, 0);
  const totalWithBaseDiscount = total * 0.8;
  const totalWithCoupon = totalWithBaseDiscount * (1 - couponDiscount);

  const addProductToCart = async (cartId: number, productId: number, quantity: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/carro-compras/addproducto/${cartId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productoId: productId, cantidadProducto: quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar producto.');
      }

      console.log('Producto agregado al carrito.');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      alert('Hubo un problema al agregar el producto al carrito.');
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
      } catch (error) {
        alert('Error al intentar incrementar el producto. Por favor, inténtalo nuevamente.');
      }
    }
  };

  const handleDecrement = (productId: number) => {
    const product = cartItems.find((item) => item.id === productId);
    if (product && product.cantidad > 1) {
      dispatch(updateQuantity({ id: productId, cantidad: -1 }));
    } else {
      alert('La cantidad no puede ser menor a 1.');
    }
  };

  const handleRemoveProductFromCart = async (productId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
      return;
    }

    if (!cartId) {
      alert('El carrito no está inicializado correctamente.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/carro-compras/removeProducto/${cartId}/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Hubo un problema al eliminar el producto.');
        return;
      }

      dispatch(removeFromCart(productId));
      const updatedCartItems = cartItems.filter((item) => item.id !== productId);
      localStorage.setItem('__redux__cart__', JSON.stringify({ productos: updatedCartItems }));

      alert('El producto ha sido eliminado del carrito.');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('No se pudo eliminar el producto.');
    }
  };

  const handleApplyCoupon = () => {
    if (coupon.trim() === 'bootcamp2024') {
      setCouponDiscount(0.05);
      alert('¡Cupón aplicado con éxito!');
    } else {
      setCouponDiscount(0);
      alert('Cupón inválido.');
    }
  };

  const handleNavigateToCheckout = async (): Promise<void> => {
    if (!cartId) {
      alert('No se encontró el carrito activo. Por favor, inténtalo nuevamente.');
      return;
    }

    try {
      console.log('Preparando creación del pedido para carrito con ID:', cartId);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token. Por favor, inicia sesión nuevamente.');
      }
      const userId = JSON.parse(atob(token.split('.')[1])).sub;
      const validateCartResponse = await fetch(`${API_BASE_URL}/carro-compras/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!validateCartResponse.ok) {
        throw new Error('No se pudo verificar el estado del carrito.');
      }

      const validatedCart = await validateCartResponse.json();
      if (!validatedCart.carroProductos || validatedCart.carroProductos.length === 0) {
        throw new Error('El carro en el backend está vacío. Inténtalo nuevamente.');
      }

      console.log('Carrito en el backend validado:', validatedCart);

      const pedidoPayload = {
        fechaCreacion: new Date().toISOString().split('T')[0],
        idCarro: cartId,
        idMedioPago: 1,
        idEstado: 1,
        idTipoDespacho: formData?.formaEnvio === 'envio' ? 1 : 2,
        receptor: formData?.quienRecibe || '',
        fechaEntrega: new Date(new Date().setDate(new Date().getDate() + 3))
          .toISOString()
          .split('T')[0],
        direccionEnvio: {
          comuna: formData?.comuna || '',
          calle: formData?.direccion || '',
          numero: formData?.numero || '0',
          departamento: formData?.departamento || '',
          referencia: formData?.referencia || '',
        },
      };

      console.log('Payload enviado al backend:', pedidoPayload);

      const pedidoResponse = await fetch(`${API_BASE_URL}/pedidos/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoPayload),
      });

      if (!pedidoResponse.ok) {
        const errorData = await pedidoResponse.json();
        throw new Error(errorData.message || 'Error al confirmar el pedido.');
      }

      const pedido = await pedidoResponse.json();
      console.log('Pedido creado con ID:', pedido.id);

      localStorage.removeItem('__redux__cart__');
      localStorage.removeItem('cartId');
      dispatch(clearCart());

      navigate('/success-page', {
        state: { compraId: pedido.id },
      });
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      alert(error instanceof Error ? error.message : 'No se pudo finalizar la compra.');
    }
  };

  const handleGoBack = () => {
    navigate('/checkout-invitado');
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
                      <img
                        src={
                          item.imagen
                            ? `${import.meta.env.MODE === 'development' ? '' : API_BASE_URL}${item.imagen}`
                            : '/estaticos/default-image.jpg'
                        }
                        alt={item.nombre}
                        className="product-image img-fluid"
                      />
                      </Col>
                      <Col md={7}>
                        <h5 className="product-title mb-2">{item.nombre}</h5>
                        {/* Precio con descuento y badge */}
                        <p className="price-text-cart mb-1">
                          Ahora ${((item.precio * 0.8).toLocaleString('es-CL'))}
                          <span className="cart-price-badge ms-2">-20%</span>
                        </p>
                        {/* Precio original tachado */}
                        <p className="original-price text-muted">
                          <del>Normal ${item.precio.toLocaleString('es-CL')}</del>
                        </p>
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
                          className="button-delete"
                          onClick={() => handleRemoveProductFromCart(item.id)}
                        >
                          <span className="material-symbols-outlined">delete</span>
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
                  <span>${total.toLocaleString('es-CL')}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Descuentos</span>
                  <span>-${(total * 0.2).toLocaleString('es-CL')}</span>
                </ListGroup.Item>
                {couponDiscount > 0 && (
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Cupón (5%)</span>
                    <span>-${(totalWithBaseDiscount * 0.05).toLocaleString('es-CL')}</span>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="d-flex justify-content-between total-row">
                  <strong>Total</strong>
                  <strong>${totalWithCoupon.toLocaleString('es-CL')}</strong>
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
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="mb-2"
              />
              <Button 
                variant="dark" 
                className="w-100"
                style={{ backgroundColor: '#1A4756' }}
                onClick={handleApplyCoupon}
              >
                Aplicar
              </Button>
            </div>

            {/* Sección de método de pago */}
            <div className="payment-method-section">
              <h6 className="mb-3">Elige cómo pagar</h6>
              
              {/* Tarjetas guardadas */}
              <div className="saved-cards mb-3">
                <p className="text-muted small mb-2">Tarjetas guardadas</p>
                <Form.Select className="mb-3">
                  <option>Falabella **9999</option>
                  {/* Agrega más opciones según las tarjetas guardadas */}
                </Form.Select>
              </div>

              {/* Billeteras digitales */}
              <div className="digital-wallets mb-4">
                <p className="text-muted small mb-2">Billeteras digitales</p>
                <div className="payment-methods">
                  <img src={webpayIcon} alt="Webpay" className="payment-icon" />
                  <img src={visaIcon} alt="Visa" className="payment-icon" />
                  <img src={mastercardIcon} alt="Mastercard" className="payment-icon" />
                  <img src={paypalIcon} alt="PayPal" className="payment-icon" />
                  <img src={transferenciaIcon} alt="Transferencia" className="payment-icon" />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Row>
        <Col md={12} className="d-flex justify-content-between mt-4">
            <Col md={4}>
            <Button
              style={{backgroundColor: 'white', color:'#1A4756', border: '3px solid #1A4756'}}
              className="bt go-button float-end"
              variant="secondary"
              onClick={handleGoBack}
            >
              Volver
            </Button>
            </Col>
            <Col md={5}>
            <Button 
              className='bt go-button float-end' 
              variant="primary" 
              onClick={handleNavigateToCheckout}
              disabled={cartItems.length === 0}
            >
              Finalizar la compra
            </Button>
            </Col>
        </Col>
      </Row> 
    </Container>
  );
};

export default CartPagePay;