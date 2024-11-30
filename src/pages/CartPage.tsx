import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, updateQuantity } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';
import { finalizePurchaseRequest } from '../endpoints/purchase';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const [coupon, setCoupon] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const userId = 2;

  const fetchActiveCart = async (): Promise<number | null> => {
    try {
      console.log(`Verificando carrito activo para el usuario ${userId}`);
      const response = await fetch(`http://localhost:8080/carro-compras/user/${userId}`, {
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
    } catch (error: any) {
      console.error('Error al verificar el carrito activo:', error.message);
      return null;
    }
  };
  
  const addProductToCart = async (cartId: number, productId: number, quantity: number) => {
  try {
    console.log(`Intentando agregar producto ${productId} al carrito ${cartId} con cantidad ${quantity}`);
    const response = await fetch(`http://localhost:8080/carro-compras/addproducto/${cartId}`, {
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
  } catch (error: any) {
    console.error('Error al agregar producto al carrito:', error.message);
    alert('Hubo un problema al agregar el producto al carrito. Inténtalo nuevamente.');
  }
};

const createCart = async () => {
  try {
    if (cartId) {
      console.log(`Ya existe un carrito activo con ID ${cartId}. No se creará uno nuevo.`);
      return;
    }

    console.log(`Creando un nuevo carrito para el usuario ${userId}`);
    const response = await fetch(`http://localhost:8080/carro-compras/${userId}`, {
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
  } catch (error: any) {
    console.error('Error crítico al intentar crear un carrito:', error.message);
    alert('Hubo un problema al crear el carrito. Inténtalo nuevamente más tarde.');
  }
};


  const handleDeleteCart = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar el carrito por completo?')) {
      return;
    }
  
    try {
      if (!cartId) {
        alert('No hay carrito asociado para eliminar.');
        return;
      }
  
      console.log(`Eliminando carrito con ID ${cartId}`);
      const response = await fetch(`http://localhost:8080/carro-compras/${cartId}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al eliminar el carrito:', errorData);
        alert(errorData.message || 'Hubo un problema al eliminar el carrito.');
        return;
      }
  
      dispatch(clearCart());
      setCartId(null);
      alert('El carrito ha sido eliminado completamente.');
    } catch (error: any) {
      console.error('Error al intentar eliminar el carrito:', error.message);
      alert('Hubo un problema al eliminar el carrito. Por favor, inténtalo nuevamente.');
    }
  };
  
  const replaceCartProducts = async () => {
    if (!cartId) {
      console.error('No se puede actualizar el carrito porque no existe un ID de carrito.');
      return;
    }

    try {
      console.log(`Actualizando productos en el carrito con ID ${cartId}`);
      const response = await fetch(`http://localhost:8080/carro-compras/replaceProductos/${cartId}`, {
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
    } catch (error: any) {
      console.error('Error al actualizar el carrito en el backend:', error.message);
      throw error;
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      const activeCartId = await fetchActiveCart();
  
      if (activeCartId) {
        console.log(`Carrito activo detectado con ID ${activeCartId}. No se creará un nuevo carrito.`);
        return;
      }
  
      console.log('No hay carrito activo. Creando uno nuevo...');
      await createCart();
    };
  
    initializeCart();
  }, []);
  

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
      await addProductToCart(cartId, productId, product.cantidad + 1);
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
  
      const response = await fetch(`http://localhost:8080/carro-compras/replaceProductos/${cartId}`, {
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
      alert('El carrito ha sido vaciado exitosamente.');
    } catch (error: any) {
      console.error('Error al intentar vaciar el carrito:', error.message);
      alert('Hubo un problema al vaciar el carrito. Por favor, inténtalo nuevamente.');
    }
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
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
    } catch (e) {
      console.error('Error al finalizar la compra:', e);
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

  return (
    <div className="container carro-container mt-4">
      <h4>Carrito de Compras</h4>
      {groupedItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {groupedItems.map((item: CartItem) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="my-0">{item.nombre}</h6>
                  <small className="text-body-secondary">Precio: ${item.precio}</small>
                </div>
                <div>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDecrement(item.id)} disabled={item.cantidad === 1}>
                    -
                  </button>
                  <span className="mx-2">{item.cantidad}</span>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleIncrement(item.id)}>
                    +
                  </button>
                  <button className="btn btn-primary btn-sm ms-2" onClick={handleDeleteCart}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h2>Total: ${formattedTotal}</h2>
          <button className="btn btn btn-outline-primary" onClick={handleClearCart}>
            Vaciar Carrito
          </button>
          <button className="btn btn-primary ms-2" onClick={handleOpenModal}>
            Pagar
          </button>
        </>
      )}

      {isModalOpen && (
        <div className="modal show" style={{ display: 'block' }} aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isPurchaseCompleted ? 'Tu compra ha sido finalizada con éxito' : 'Resumen del Pedido'}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {isPurchaseCompleted ? (
                  <>
                    <p>¡Gracias por tu compra!</p>
                    <h6>Detalles del pedido:</h6>
                    <ul className="list-group">
                      {purchasedItems.map((item: CartItem) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between">
                          <span>{item.nombre}</span>
                          <span>x {item.cantidad} - ${item.precio * item.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                    <p>
                      El total de tu compra fue de: <h3>${formattedTotal}</h3>
                    </p>
                  </>
                ) : (
                  <>
                    <span>Aplicar cupón de descuento?</span>
                    <div className="input-group mb-3">
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
                    <ul className="list-group">
                      {groupedItems.map((item: CartItem) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between">
                          <span>{item.nombre}</span>
                          <span> x {item.cantidad} - ${item.precio * item.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                    <h3 className="mt-3">Total: ${formattedTotal}</h3>
                  </>
                )}
              </div>
              <div className="modal-footer">
                {isPurchaseCompleted ? (
                  <button className="btn btn-primary" onClick={handleCloseModal}>
                    Cerrar
                  </button>
                ) : (
                  <>
                    <button className="btn btn-secondary" onClick={handleCloseModal}>
                      Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleFinalizePurchase} disabled={loading}>
                      {loading ? 'Procesando...' : 'Finalizar Compra'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;



