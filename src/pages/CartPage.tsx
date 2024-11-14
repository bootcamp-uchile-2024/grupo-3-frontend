import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart, updateQuantity } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';
import { finalizePurchaseRequest } from '../endpoints/purchase';

// Componente principal del Carrito de Compras
const CartPage: React.FC = () => {
  // Usamos el hook useDispatch para despachar acciones a Redux
  const dispatch = useDispatch();

  // Seleccionamos los productos en el carrito del estado de Redux
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);

  // Estados locales para controlar el comportamiento de la UI
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal está abierto
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false); // Indica si la compra fue completada
  const [coupon, setCoupon] = useState<string>(''); // Guarda el valor del cupón ingresado
  const [discount, setDiscount] = useState<number>(0); // Guarda el descuento aplicado
  const [purchaseTotal, setPurchaseTotal] = useState<number | null>(null); // Guarda el total de la compra
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]); // Guarda los productos comprados
  const [loading, setLoading] = useState<boolean>(false); // Controla el estado de carga al finalizar la compra
  const [, setError] = useState<string | null>(null); // Para manejar errores, aunque no se utiliza aquí

  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    // Carga los productos desde el localStorage y los despacha para actualizar el carrito en el estado global
    const storedCart = localStorage.getItem('__redux__cart__');
    console.log('Stored cart:', storedCart);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      if (parsedCart && parsedCart.items) {
        parsedCart.items.forEach((item: CartItem) => {
          dispatch(updateQuantity({ id: item.id, cantidad: item.cantidad }));
        });
      }
    }
  }, [dispatch]); // La dependencia [dispatch] asegura que solo se ejecute una vez al montar el componente

  // Función para aplicar un cupón de descuento
  const handleApplyCoupon = () => {
    if (coupon === 'bootcamp2024') {
      setDiscount(0.1); // Aplica un 10% de descuento si el cupón es válido
    } else {
      alert('Cupón inválido.');
      setDiscount(0); // Si el cupón es incorrecto, no aplica descuento
    }
  };

  // Función para eliminar un producto del carrito
  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart(productId)); // Despacha la acción para eliminar el producto
  };

  // Función para incrementar la cantidad de un producto
  const handleIncrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: 1 })); // Despacha la acción para incrementar la cantidad
  };

  // Función para decrementar la cantidad de un producto
  const handleDecrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: -1 })); // Despacha la acción para decrementar la cantidad
  };

  // Función para vaciar el carrito
  const handleClearCart = () => {
    dispatch(clearCart()); // Despacha la acción para limpiar el carrito
  };

  // Función para crear un carrito de compras en el backend
  const handleCreateCart = async () => {
    try {
      const userId = 1; // Esto debe ser dinámico, dependiendo del usuario logueado
      const response = await fetch(`http://localhost:8080/carro-compras/${userId}`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }), // Envia los items del carrito al backend
      });

      if (response.ok) {
        alert('Carrito de compras creado correctamente');
      } else {
        alert('Hubo un problema al crear el carrito de compras');
      }
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      alert('Error al crear el carrito de compras');
    }
  };

  // Función para eliminar el carrito en el backend
  const handleDeleteCart = async () => {
    try {
      const user_Id = 2; // ID estático, debería ser dinámico
      const response = await fetch(`http://localhost:8080/carro-compras/${user_Id}`, {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
        },
      });

      if (response.ok) {
        handleClearCart(); // Limpia el carrito si la eliminación fue exitosa
        alert('Carro de compras eliminado correctamente');
      } else {
        alert('Hubo un problema al eliminar el carrito de compras');
      }
    } catch (error) {
      console.error('Error al borrar el carrito:', error);
      alert('Error al borrar el carrito de compras');
    }
  };

  // Función para abrir el modal de pago
  const handleOpenModal = () => {
    setIsModalOpen(true); // Cambia el estado para mostrar el modal
  };

  // Función para cerrar el modal de pago
  const handleCloseModal = () => {
    setIsModalOpen(false); // Cambia el estado para cerrar el modal
    setIsPurchaseCompleted(false); // Reinicia el estado de compra completada
  };

  // Función para finalizar la compra
  const handleFinalizePurchase = async () => {
    setLoading(true); // Activa el estado de carga
    setError(null); // Limpia cualquier error previo

    setPurchasedItems(groupedItems); // Guarda los productos que se han comprado
    setPurchaseTotal(discountedTotal); // Guarda el total con descuento

    try {
      const response = await finalizePurchaseRequest(cartItems); // Realiza la solicitud para finalizar la compra
      console.log('Compra finalizada con éxito: HTTP statuscode ' + response.statusCode);
      handleClearCart(); // Limpia el carrito después de la compra
      setIsPurchaseCompleted(true); // Cambia el estado de compra completada
    } catch (error) {
      setError('Hubo un problema al finalizar la compra. Por favor, inténtalo nuevamente.'); // Manejo de errores
      console.error(error);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  // Agrupa los productos por ID y suma las cantidades
  const groupedItems = cartItems.reduce((acc: CartItem[], item: CartItem) => {
    const existingItem = acc.find((i: CartItem) => i.id === item.id);
    if (existingItem) {
      existingItem.cantidad += item.cantidad; // Si el producto ya existe, solo aumenta la cantidad
    } else {
      acc.push({ ...item }); // Si el producto no existe, lo agrega al acumulador
    }
    return acc;
  }, []);

  // Calcula el total del carrito antes del descuento
  const total = groupedItems.reduce((acc: number, item: CartItem) => {
    return acc + item.precio * item.cantidad; // Suma el precio de cada producto multiplicado por su cantidad
  }, 0);

  // Aplica el descuento al total
  const discountedTotal = total * (1 - discount);

  // Formatea el total con descuento a una moneda legible
  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(discountedTotal);

  return (
    <div className="container mt-4">
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
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDecrement(item.id)} disabled={item.cantidad === 1}>-</button>
                  <span className="mx-2">{item.cantidad}</span>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleIncrement(item.id)}>+</button>
                  <button className="btn btn-danger btn-sm ms-2" onClick={() => handleRemoveFromCart(item.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          <h2>Total: ${formattedTotal}</h2>
          <button className="btn btn-danger" onClick={handleClearCart}>Vaciar Carrito</button>
          <button className="btn btn-primary ms-2" onClick={handleOpenModal}>Pagar</button>
          <button className="btn btn-danger ms-2" onClick={handleDeleteCart}>Eliminar Carro de Compras</button>
          <button className="btn btn-success ms-2" onClick={handleCreateCart}>Crear Carrito</button>
        </>
      )}

      {isModalOpen && (
        <div className="modal show" style={{ display: 'block' }} aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isPurchaseCompleted ? 'Tu compra ha sido finalizada con éxito' : 'Resumen del Pedido'}
                </h5>
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
                    <p>El total de tu compra fue de: <h3>${new Intl.NumberFormat('es-CL', {
                      style: 'decimal',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(purchaseTotal || 0)}</h3></p>
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
                      <button className="btn btn-outline-secondary" onClick={handleApplyCoupon}>
                        Aplicar
                      </button>
                    </div>
                    <p>Total a pagar: <strong>${formattedTotal}</strong></p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
                {!isPurchaseCompleted && (
                  <button type="button" className="btn btn-primary" onClick={handleFinalizePurchase} disabled={loading}>
                    {loading ? 'Procesando...' : 'Finalizar Compra'}
                  </button>
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