import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, updateQuantity} from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import '../styles/CartPage.css';
import {
  fetchActiveCart,
  handleRemoveProductFromCart,
  replaceCartProducts,
  initializeCart
} from '../utils/cartHelpers';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const [coupon, setCoupon] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [purchasedItems ] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const userId = 2;

  const API_BASE_URL = import.meta.env.VITE_URL_ENDPOINT_BACKEND || 'http://localhost:8080';

  const updateLocalStorage = (productos: CartItem[]) => {
    localStorage.setItem('__redux__cart__', JSON.stringify({ productos }));
    console.log('Carrito actualizado en localStorage:', productos);
  };
  
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
  
        const newItem: CartItem = {
          id: productId,
          cantidad: quantity,
          nombre: data.producto.nombre,
          precio: data.producto.precio,
          imagen: data.producto.imagen,
          descripcion: data.producto.descripcion,
          unidadesVendidas: data.producto.unidadesVendidas || 0,
          puntuacion: data.producto.puntuacion || 0,
          ancho: data.producto.ancho || 0,
          alto: data.producto.alto || 0,
          largo: data.producto.largo || 0, 
          peso: data.producto.peso || 0, 
        };
  
        const updatedCartItems = [...cartItems, newItem];
        updateLocalStorage(updatedCartItems);
  
        console.log('Producto agregado al carrito:', newItem);
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
      console.error('Error: cartId no está definido.');
      alert('No se ha inicializado el carrito. Por favor, recarga la página.');
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
    if (!cartId) {
        alert('No hay un carrito asociado para vaciar.');
        return;
    }

    try {
        console.log(`Vaciando carrito con ID ${cartId}`);

        const response = await fetch(`${API_BASE_URL}/carro-compras/replaceProductos/${cartId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productosCarro: [] }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al vaciar el carrito:', errorData);
            alert(`Error al vaciar el carrito: ${errorData.message || 'Error desconocido'}`);
            return;
        }

        dispatch(clearCart());
        localStorage.removeItem('__redux__cart__');
        console.log('Estado actual del localStorage después de limpiar:', localStorage.getItem('__redux__cart__')); // Depuración

        alert('El carrito ha sido vaciado exitosamente.');
    } catch (error) {
        console.error('Error al intentar vaciar el carrito:', error);
        alert('Hubo un problema al vaciar el carrito. Por favor, inténtalo nuevamente.');
    }
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPurchaseCompleted(false);
  };

  const  handleFinalizePurchase = async () => {
    if (!cartId || cartItems.length === 0) {
        console.warn('El carrito está vacío o no tiene un cartId válido.');
        alert('El carrito está vacío. No se puede finalizar la compra.');
        return;
    }

    setLoading(true);

    try {
        console.log('Sincronizando productos antes de finalizar la compra...');
        await replaceCartProducts(cartId, cartItems);

        const payload = {
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
        };

        console.log('Enviando datos al endpoint de finalizar compra:', payload);
        const response = await fetch(`${API_BASE_URL}/pedidos/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al finalizar la compra:', errorData);
            alert(`Error al finalizar la compra: ${errorData.message || 'Error desconocido'}`);
            return;
        }

        const data = await response.json();
        console.log('Compra finalizada exitosamente:', data);

        console.log('Limpiando carrito anterior en Redux y localStorage...');
        dispatch(clearCart()); 
        localStorage.removeItem('__redux__cart__'); 

        console.log('Obteniendo nuevo carrito activo del backend...');
        const newCartId = await fetchActiveCart(userId, setCartId);

        if (newCartId) {
            console.log(`Nuevo carrito activo sincronizado con ID ${newCartId}`);
        } else {
            console.warn('No se pudo sincronizar con un nuevo carrito activo.');
        }

        setIsPurchaseCompleted(true);
        navigate('/success-page');
    } catch (error) {
        console.error('Error crítico al finalizar la compra:', error);
        alert('Hubo un problema al finalizar la compra. Por favor, inténtalo nuevamente.');
    } finally {
        setLoading(false);
    }
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
    navigate('/login-checkout');
  };

  return (
    <Container className="cart-container">
       <Row className="justify-content-center">
        <Col md={5} className='me-5'>
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
                        <p className="price-text mb-1">Ahora ${item.precio.toLocaleString('es-CL')}</p>
                        <p className="original-price text-muted">Normal ${item.precio}</p>
                        <div className="quantity-controls">
                          <Button
                            className='btn-circle'
                            size="sm"
                            onClick={() => handleDecrement(item.id)}
                            disabled={item.cantidad === 1}
                          >
                            -
                          </Button>
                          <span className="mx-3">{item.cantidad}</span>
                          <Button
                            className='btn-circle'
                            size="sm"
                            onClick={() => handleIncrement(item.id)}
                          >
                            +
                          </Button>
                        </div>
                      </Col>
                      <Col md={1}>
                        <Button
                          variant="link"
                          className="text-danger"
                          onClick={() => handleRemoveProductFromCart(cartId, item.id, dispatch)}

                        >
                          <span className="material-symbols-outlined">delete</span>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Col>

        <Col md={5} className='mt-5'>
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

export default CartPage;



