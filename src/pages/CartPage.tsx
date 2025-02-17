import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateQuantity } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem, PromocionDestacada } from '../interfaces/CartItem';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import '../styles/CartPage.css';

const baseUrl = import.meta.env.VITE_API_URL;

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);
  const navigate = useNavigate();

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

  const getDiscountedPrice = (item: CartItem): number => {
    let discountedPrice = item.precio;
    if (item.promocionesDestacadas && item.promocionesDestacadas.length > 0) {
      const promoTradicional = item.promocionesDestacadas.find(
        (promo: PromocionDestacada) => promo.tipoPromocion === "TRADICIONAL" && promo.valor > 0
      );
      if (promoTradicional) {
        if (promoTradicional.tipoDescuento === 'PORCENTAJE') {
          discountedPrice = item.precio * (1 - promoTradicional.valor / 100);
        } else {
          discountedPrice = item.precio - promoTradicional.valor;
        }
      }
    }
    return discountedPrice;
  };

  const totalOriginal = groupedItems.reduce((acc: number, item: CartItem) => {
    return acc + item.precio * item.cantidad;
  }, 0);

  const totalDiscounted = groupedItems.reduce((acc: number, item: CartItem) => {
    const discountedPrice = getDiscountedPrice(item);
    return acc + discountedPrice * item.cantidad;
  }, 0);

  const discountValue = totalOriginal - totalDiscounted;

  return (
    <Container className="cart-container vh-85">
      <Row className="justify-content-center">
        <Col md={6} className="me-3">
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
                {groupedItems.map((item: CartItem) => {
                  const discountedPrice = getDiscountedPrice(item);
                  const promoTradicional = item.promocionesDestacadas?.find(
                    (promo: PromocionDestacada) =>
                      promo.tipoPromocion === "TRADICIONAL" && promo.valor > 0
                  );
                  return (
                    <ListGroup.Item key={item.id} className="cart-item">
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={
                              item.imagen
                                ? `${baseUrl}${item.imagen}`
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
                              Ahora ${discountedPrice.toLocaleString('es-CL')}
                            </p>
                            {promoTradicional && (
                              <span className="cart-price-badge">
                                {promoTradicional.tipoDescuento === 'PORCENTAJE'
                                  ? `-${promoTradicional.valor}%`
                                  : `-$${promoTradicional.valor}`}
                              </span>
                            )}
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
                  );
                })}
              </ListGroup>
            </div>
          )}
        </Col>

        <Col md={5} className="mt-5">
          <Card className="summary-card">
            <Card.Body>
              <Card.Title><h4>Resumen de mi compra</h4></Card.Title>
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Costos de tus productos</span>
                  <span>${totalOriginal.toLocaleString('es-CL')}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Descuentos</span>
                  <span>-${discountValue.toLocaleString('es-CL')}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Envío</span>
                  <span>$0</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between total-row">
                  <strong>Total</strong>
                  <strong>${totalDiscounted.toLocaleString('es-CL')}</strong>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="d-flex justify-content-between mt-4">
          <Col sm={5} md={4}>
            <Button
              style={{ backgroundColor: 'white', color: '#1A4756', border: '3px solid #1A4756' }}
              className="bt go-button float-end"
              variant="secondary"
              onClick={handleGoBack}
            >
              Volver
            </Button>
          </Col>
          <Col sm={9} md={5}>
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