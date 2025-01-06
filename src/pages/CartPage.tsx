import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateQuantity, addToCart } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import '../styles/CartPage.css';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);
  const navigate = useNavigate();

  const syncCartWithLocalStorage = useCallback(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      const parsedCart: CartItem[] = JSON.parse(storedCart);
      parsedCart.forEach((item) => dispatch(addToCart(item)));
    }
  }, [dispatch]);

  useEffect(() => {
    syncCartWithLocalStorage();
  }, [syncCartWithLocalStorage]);

  const handleIncrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: 1 }));
  };

  const handleDecrement = (productId: number) => {
    const product = cartItems.find((item) => item.id === productId);
    if (product && product.cantidad > 1) {
      dispatch(updateQuantity({ id: productId, cantidad: -1 }));
    }
  };

  const handleRemoveProductFromCart = (productId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
      dispatch(removeFromCart(productId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      dispatch(clearCart());
      localStorage.removeItem('cartItems');
    }
  };

  const handleNavigateToCheckout = () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de continuar.');
      return;
    }
    navigate('/login-checkout');
  };

  const handleGoBack = () => {
    navigate('/catalogo');
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

  return (
    <Container className="cart-container vh-70">
      <Row className="justify-content-center">
        <Col md={5} className="me-5">
          <div className="cart-header">
            <h4>Tu compra</h4>
            {groupedItems.length > 0 && (
              <Button
                className="empty-cart-button"
                variant="link"
                onClick={handleClearCart}
              >
                Vaciar Carrito
              </Button>
            )}
          </div>
          {groupedItems.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <div className="products-scroll-container">
              <ListGroup className="mb-4">
                {groupedItems.map((item: CartItem) => (
                  <ListGroup.Item key={item.id} className="cart-item">
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={
                            item.imagenes && item.imagenes.length > 0
                              ? `${import.meta.env.MODE === 'development' ? '' : baseUrl}${item.imagenes[0].ruta}`
                              : '/estaticos/default-image.jpg'
                          }
                          alt={item.nombre}
                          className="product-image img-fluid"
                        />
                      </Col>
                      <Col md={6}>
                        <h5 className="product-title mb-2">{item.nombre}</h5>
                        <div className="d-flex align-items-center gap-2">
                          <p className="price-text-cart mb-1">
                            Ahora ${(item.precio * 0.8).toLocaleString('es-CL')}
                          </p>
                          <span className="cart-price-badge">-20%</span>
                        </div>
                        <p className="original-price text-muted">
                          Normal ${item.precio.toLocaleString('es-CL')}
                        </p>
                        <div className="quantity-controls">
                          <Button
                            className="btn-circle-cart"
                            size="sm"
                            onClick={() => handleDecrement(item.id)}
                            disabled={item.cantidad === 1}
                          >
                            -
                          </Button>
                          <span className="mx-3">{item.cantidad}</span>
                          <Button
                            className="btn-circle-cart"
                            size="sm"
                            onClick={() => handleIncrement(item.id)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="link"
                          className="button-delete mt-4"
                          onClick={() => handleRemoveProductFromCart(item.id)}
                        >
                          eliminar<span className="material-symbols-outlined">delete</span>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Col>

        <Col md={5} className="mt-5">
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
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Envío</span>
                  <span>$0</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between total-row">
                  <strong>Total</strong>
                  <strong>${(total * 0.8).toLocaleString('es-CL')}</strong>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="d-flex justify-content-between mt-4">
          <Col md={4}>
            <Button
              style={{ backgroundColor: 'white', color: '#1A4756', border: '3px solid #1A4756' }}
              className="bt go-button float-end"
              variant="secondary"
              onClick={handleGoBack}
            >
              Volver
            </Button>
          </Col>
          <Col md={5}>
            <Button
              className="bt go-button float-end"
              variant="primary"
              onClick={handleNavigateToCheckout}
              disabled={groupedItems.length === 0}
            >
              Finalizar la compra
            </Button>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;




