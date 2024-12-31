import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateQuantity, addToCart } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import '../styles/CartPage.css';


  const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);
  const navigate = useNavigate();
  const [cartId, setCartId] = useState<number | null>(null);
  const userId = 1;
  const API_BASE_URL = 'http://localhost:8080';

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Error inesperado.';
  };

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

  const createCart = useCallback(async () => {
    if (cartId) {
      console.log(`Ya existe un carrito activo con ID ${cartId}. No se creará uno nuevo.`);
      return;
    }

    try {
      console.log(`Creando un nuevo carrito para el usuario ${userId}`);
      const response = await fetch(`${API_BASE_URL}/carro-compras/${userId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setCartId(data.id);
        console.log('Carrito creado exitosamente:', data);
      } else {
        const errorData = await response.json();
        console.error('Error al crear el carrito:', errorData.message);
      }
    } catch (error) {
      console.error('Error crítico al intentar crear el carrito:', error);
    }
  }, [cartId, userId, API_BASE_URL]);

  const addProductToCart = async (cartId: number, productId: number, quantity: number) => {
    try {
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
        console.log('Producto agregado al carrito:', data);
        await replaceCartProducts();
      } else {
        console.error('Error en la respuesta del servidor:', await response.json());
        throw new Error(`Error HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };

  const replaceCartProducts = async () => {
    if (!cartId) {
      console.error('No se puede actualizar el carrito porque no existe un ID de carrito.');
      return;
    }

    try {
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
        throw new Error(`errorData.message || Error HTTP: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error al actualizar el carrito en el backend:', getErrorMessage(error));
      throw error;
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
      console.log(`Sincronizando carrito con ID: ${cartId}`);
      await replaceCartProducts();

      console.log(`Eliminando producto ID: ${productId} del carrito ID: ${cartId}`);
      const response = await fetch(`${API_BASE_URL}/carro-compras/removeProducto/${cartId}/${productId}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        let errorMessage = 'Hubo un problema al eliminar el producto.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error al parsear la respuesta de error:', e);
        }
        alert(errorMessage);
        return;
      }

      dispatch(removeFromCart(productId));
      alert('El producto ha sido eliminado del carrito.');
    } catch (error) {
      console.error('Error al intentar sincronizar y eliminar el producto:', error);
      alert('No se pudo sincronizar y eliminar el producto. Inténtalo nuevamente.');
    }
  };

  const loadCartProducts = useCallback(async (cartId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/carro-compras/${cartId}/`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Productos cargados del carrito:', data);
  
        if (data.productos && data.productos.length > 0) {
          dispatch(clearCart());
  
          for (const item of data.productos) {
            const productResponse = await fetch(`${API_BASE_URL}/producto/${item.productoId}`, {
              method: 'GET',
              headers: { Accept: 'application/json' },
            });
  
            if (productResponse.ok) {
              const productData = await productResponse.json();
              const imagePath = productData.imagenes && productData.imagenes.length > 0
                ? productData.imagenes[0].ruta
                : '/estaticos/default-image.jpg';
  
              dispatch(addToCart({
                id: productData.id,
                nombre: productData.nombre,
                precio: productData.precio,
                imagen: imagePath,
                descripcion: productData.descripcion,
                cantidad: item.cantidadProducto,
                unidadesVendidas: productData.unidadesVendidas,
                puntuacion: productData.puntuacion,
                ancho: productData.ancho,
                alto: productData.alto,
                largo: productData.largo,
                peso: productData.peso,
                stock: productData.stock,
              }));
            } else {
              console.error(`Error al obtener detalles del producto ID: ${item.productoId}`);
              dispatch(addToCart({
                id: item.productoId,
                nombre: 'Producto Desconocido',
                precio: 0,
                imagen: '/estaticos/default-image.jpg',
                descripcion: 'Descripción no disponible',
                cantidad: item.cantidadProducto,
                unidadesVendidas: 0,
                puntuacion: 0,
                ancho: 0,
                alto: 0,
                largo: 0,
                peso: 0,
                stock: 0,
              }));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar productos del carrito:', error);
    }
  }, [dispatch, API_BASE_URL]);
  

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

        await replaceCartProducts();
      } catch (_error) {
        alert('Error al intentar incrementar el producto. Por favor, inténtalo nuevamente.');
      }
    }
  };

  const handleDecrement = async (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: -1 }));

    await replaceCartProducts();
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

      localStorage.removeItem('__redux__cart__');

      alert('El carrito ha sido vaciado exitosamente.');
    } catch (error) {
      console.error('Error al intentar vaciar el carrito:', error);
      alert('Hubo un problema al vaciar el carrito. Por favor, inténtalo nuevamente.');
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const activeCartId = await fetchActiveCart();

        if (activeCartId) {
          console.log(`Carrito activo detectado con ID ${activeCartId}.`);
          setCartId(activeCartId);

          const response = await fetch(`${API_BASE_URL}/carro-compras/${activeCartId}`);
          if (response.ok) {
            const cartData = await response.json();

            if (cartData.carroProductos && cartData.carroProductos.length > 0) {
              await loadCartProducts(activeCartId);
            }
          }
        } else {
          await createCart();
        }
      } catch (error) {
        console.error('Error al inicializar el carrito:', error);
      }
    };

    initializeCart();
  }, [fetchActiveCart, createCart, dispatch, API_BASE_URL, loadCartProducts]);

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

  const handleNavigateToCheckout = async (): Promise<void> => {
    if (!cartId) {
      alert('No se ha inicializado el carrito.');
      return;
    }

    try {
      localStorage.setItem('cartId', cartId.toString());

      await replaceCartProducts();

      navigate('/login-checkout');
    } catch (error) {
      console.error('Error al sincronizar el carrito antes de navegar:', error);
      alert('Hubo un problema al procesar tu carrito. Por favor, inténtalo nuevamente.');
    }
  };

  const handleGoBack = () => {
    navigate('/catalogo');
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
                  <Row className="align-items-center">
                    <Col md={6}>
                      <img
                        src={item.imagen || '/estaticos/default-image.jpg'}
                        alt={item.nombre}
                        className="product-image img-fluid"
                      />
                    </Col>
                    <Col md={6}>
                      <h5 className="product-title mb-2">{item.nombre}</h5>
                      <div className="d-flex align-items-center gap-2">
                        <p className="price-text-cart mb-1">Ahora ${(item.precio * 0.8).toLocaleString('es-CL')}</p>
                        <span className="cart-price-badge">-20%</span>
                      </div>
                      <p className="original-price text-muted">Normal ${item.precio.toLocaleString('es-CL')}</p>
                      <div className="quantity-controls">
                        <Button className='btn-circle-cart' size="sm" onClick={() => handleDecrement(item.id)} disabled={item.cantidad === 1}>
                          -
                        </Button>
                        <span className="mx-3">{item.cantidad}</span>
                        <Button className='btn-circle-cart' size="sm" onClick={() => handleIncrement(item.id)}>
                          +
                        </Button>
                      </div>
                      <Button variant="link" className="button-delete mt-4" onClick={() => handleRemoveProductFromCart(item.id)}>
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

        <Col md={5} className='mt-5'>
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
              className='bt go-button float-end'
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