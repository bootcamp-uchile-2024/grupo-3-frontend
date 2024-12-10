import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateQuantity, addToCart } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';
import { finalizePurchaseRequest } from '../endpoints/purchase';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import '../styles/CartPage.css';


const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const [coupon, setCoupon] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const userId = 1;

  const API_BASE_URL = import.meta.env.VITE_URL_ENDPOINT_BACKEND || 'http://localhost:8080';

  const fetchActiveCart = useCallback(async (): Promise<number | null> => {
    try {
      console.log(`Verificando carrito activo para el usuario ${userId}`);
      const response = await fetch(`${API_BASE_URL}/carro-compras/user/${userId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setCartId(data.id);
        console.log('Carrito activo encontrado:', data);
        return data.id;
      } else if (response.status === 404) {
        console.log('No hay carrito activo para este usuario.');
        setCartId(null);
        return null;
      } else {
        throw new Error(`Error HTTP al verificar el carrito: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error(getErrorMessage(error));
      return null;
    }
  }, [userId, setCartId, API_BASE_URL]);

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

  const createCart = useCallback(async () => {
    try {
      if (cartId) {
        console.log(`Ya existe un carrito activo con ID ${cartId}. No se creará uno nuevo.`);
        return;
      }

      console.log(`Creando un nuevo carrito para el usuario ${userId}`);
      const response = await fetch(`${API_BASE_URL}/carro-compras/${userId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al crear el carrito:', errorData);

        if (response.status === 400) {
          console.error('El servidor rechazó la creación del carrito (400).');
          alert(errorData.message || 'No se pudo crear el carrito debido a un error en el servidor. Contacta soporte.');
          return;
        }

        throw new Error(errorData.message || `Error HTTP al crear carrito: ${response.status}`);
      }

      const data = await response.json();
      setCartId(data.id);
      console.log('Carrito creado con éxito:', data);
    } catch (error: unknown) {
      console.error('Error crítico al intentar crear un carrito:', getErrorMessage(error));
      alert('Hubo un problema al crear el carrito. Inténtalo nuevamente más tarde.');
    }
  }, [cartId, userId, API_BASE_URL]);

  const handleRemoveProductFromCart = async (productId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
      return;
    }

    try {
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
      console.log('Inicializando carrito...');
      const activeCartId = await fetchActiveCart();
  
      if (activeCartId) {
        console.log(`Carrito activo detectado con ID ${activeCartId}.`);
        const savedCartItems = localStorage.getItem('__redux__cart__');
  
        if (savedCartItems) {
          try {
            const parsedCart = JSON.parse(savedCartItems);
  
            if (parsedCart && Array.isArray(parsedCart.productos)) {
              if (parsedCart.productos.length > 0) {
                console.log('Sincronizando carrito desde el localStorage...');
                dispatch(clearCart());
                parsedCart.productos.forEach((item: CartItem) => {
                  dispatch(addToCart(item));
                });
              } else {
                console.log('El carrito está vacío en localStorage. No se sincronizará.');
                dispatch(clearCart());
                localStorage.removeItem('__redux__cart__');
              }
            } else {
              console.warn('El carrito en localStorage tiene un formato inválido.');
            }
          } catch (error) {
            console.error('Error al parsear los datos del carrito:', error);
          }
        }
        return;
      }
  
      console.log('No hay carrito activo. Creando uno nuevo...');
      await createCart();
    };
  
    initializeCart();
  }, [fetchActiveCart, createCart, dispatch]);
  

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

      const data = await response.json();
      console.log('Carrito vaciado en el backend:', data);

      dispatch(clearCart());
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

  const handleFinalizePurchase = async () => {
    setLoading(true);
    setPurchasedItems(cartItems);

    try {
      if (!cartId && cartItems.length > 0) {
        console.log('No hay carrito activo. Creando uno nuevo.');
        await createCart();
      }
      await replaceCartProducts();
      const response = await finalizePurchaseRequest(cartItems);
      if (response.statusCode === 200) {
        console.log('Compra finalizada exitosamente.');
        handleClearCart();
        setIsPurchaseCompleted(true);
      } else {
        console.error('Error al finalizar la compra:', response.statusCode);
        alert(`Error al finalizar la compra: Código ${response.statusCode}`);
      }
    } catch (e: unknown) {
      console.error('Error al finalizar la compra:', getErrorMessage(e));
      alert('Error al finalizar la compra. Por favor, inténtalo nuevamente.');
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
                      <Col md={1}>
                        <Button
                          variant="link"
                          className="text-danger"
                          onClick={() => handleRemoveProductFromCart(item.id)}
                        >
                          Eliminar
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



