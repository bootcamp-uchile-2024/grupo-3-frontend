import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateQuantity, addToCart } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';
import { Button, Card, Col, Container, ListGroup, Row, Form } from 'react-bootstrap';
import '../styles/CartPage.css';


const CartPagePay: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { formData, pedidoId } = location.state || {};

  const [cartId, setCartId] = useState<number | null>(null);
  const [coupon, setCoupon] = useState<string>(''); 
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const groupedItems = cartItems.reduce((acc: CartItem[], item: CartItem) => {
    const existingItem = acc.find((i: CartItem) => i.id === item.id);
    if (existingItem) {
      existingItem.cantidad += item.cantidad;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  // Cálculos de totales
  const total = groupedItems.reduce((acc: number, item: CartItem) => {
    return acc + item.precio * item.cantidad;
  }, 0);

  const totalWithBaseDiscount = total * 0.8; 
  const totalWithCoupon = totalWithBaseDiscount * (1 - couponDiscount); 

  const userId = 1;


  const API_BASE_URL = import.meta.env.VITE_URL_ENDPOINT_BACKEND || 'http://localhost:8080';

  const fetchActiveCart = useCallback(async (): Promise<number | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/carro-compras/user/${userId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
  
      if (response.ok) {
        const data = await response.json();
        setCartId(data.id); 
        return data.id;
      } else {
        console.warn('No se encontró un carrito activo.');
        setCartId(null);
        return null;
      }
    } catch (error) {
      console.error('Error al buscar carrito activo:', error);
      return null;
    }
  }, [userId, API_BASE_URL]);
  

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



  const handleRemoveProductFromCart = async (productId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
      return;
    }
  
    if (!cartId) {
      alert('El carrito no está inicializado correctamente.');
      return;
    }
  
    try {
      console.log(`Sincronizando carrito con ID: ${cartId} antes de eliminar producto`);
      await replaceCartProducts();
  
      console.log(`Eliminando producto ID: ${productId} del carrito ID: ${cartId}`);
      const response = await fetch(
        `${API_BASE_URL}/carro-compras/removeProducto/${cartId}/${productId}`,
        {
          method: 'DELETE',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Hubo un problema al eliminar el producto.');
        return;
      }
  
      dispatch(removeFromCart(productId));

      const updatedCartItems = cartItems.filter(item => item.id !== productId);
      localStorage.setItem('__redux__cart__', JSON.stringify({ productos: updatedCartItems }));
  
      alert('El producto ha sido eliminado del carrito.');
    } catch (error) {
      console.error('Error al intentar eliminar el producto:', error);
      alert('No se pudo eliminar el producto. Por favor, inténtalo nuevamente.');
    }
  };
  
  const replaceCartProducts = async () => {
    if (!cartId) {
      console.error('No se puede actualizar el carrito porque no existe un ID de carrito.');
      return;
    }

    try {
      console.log(`Actualizando productos en el carrito con ID ${cartId}`);
      const response = await fetch(`${API_BASE_URL}/carro-compras/replaceProductos/${cartId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productosCarro: cartItems.map((item) => ({
            productoId: item.id,
            cantidadProducto: item.cantidad,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      console.log('Productos del carrito actualizados en el backend.');
    } catch (error: unknown) {
      console.error('Error al actualizar el carrito en el backend:', getErrorMessage(error));
      throw error;
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      const activeCartId = await fetchActiveCart();

      if (activeCartId) {
        const savedCartItems = localStorage.getItem('__redux__cart__');
        if (savedCartItems) {
          try {
            const parsedCart = JSON.parse(savedCartItems);

            if (parsedCart && Array.isArray(parsedCart.productos)) {
              dispatch(clearCart());

              parsedCart.productos.forEach((item: CartItem) => {
                dispatch(addToCart(item));
              });
            } else {
              console.warn('El contenido de productos no es un array:', parsedCart.productos);
            }
          } catch (error) {
            console.error('Error al parsear los datos del carrito desde localStorage:', error);
          }
        }
        return;
      }

      console.log('No hay carrito activo. Creando uno nuevo...');
    };

    initializeCart();
  }, [fetchActiveCart, dispatch]);

  const handleApplyCoupon = () => {
    if (coupon.trim() === 'bootcamp2024') {
      setCouponDiscount(0.05); 
      alert('¡Cupón aplicado con éxito! Se ha descontado un 5% adicional.');
    } else {
      setCouponDiscount(0); 
      alert('Cupón inválido. Inténtalo nuevamente.');
    }
  };
  
  

  if (!formData || !pedidoId) {
    console.error('No se encontraron datos para la página de pago.');
    return <p>Error: No hay datos disponibles para finalizar el pago.</p>;
  }

  console.log('Datos recibidos en CartPagePay:', formData, pedidoId);

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

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Error inesperado.';
  };

  const handleNavigateToCheckout = (): void => {
    console.log('Limpiando localStorage y Redux antes de redirigir a /success-page.');
    
    localStorage.removeItem('__redux__cart__'); 
    dispatch(clearCart());
    navigate('/success-page');
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
                          src={item.imagen || 'placeholder.jpg'}
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



