import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart, updateQuantity } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from "../interfaces/CartItem";

const CartPage: React.FC = () => {
 
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState<boolean>(false); 
  const [coupon, setCoupon] = useState<string>(''); 
  const [discount, setDiscount] = useState<number>(0); 
  const [purchaseTotal, setPurchaseTotal] = useState<number | null>(null); 
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [, setError] = useState<string | null>(null); 

  useEffect(() => {
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
  }, [dispatch]);

  const idUsuario = (): number | null => {
    const userId = 1; 
    return userId;
  };

  const handleApplyCoupon = () => {
    if (coupon === 'bootcamp2024') {
      setDiscount(0.1); 
    } else {
      alert('Cupón inválido.');
      setDiscount(0); 
    }
  };

  const handleCreateCart = async () => {
    const userId = idUsuario(); 
    if (!userId) {
      alert('Error: No se encontró el ID de usuario');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/carro-compras/${userId}`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
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

  // Función para modificar el carrito en el backend
  const handleUpdateCart = async (updatedItems: CartItem[]) => {
    const userId = idUsuario();
    if (!userId) {
      alert('Error: No se encontró el ID de usuario');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/carro-compras/${userId}`, {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (response.ok) {
        alert('Carrito de compras actualizado correctamente');
      } else {
        alert('Hubo un problema al actualizar el carrito de compras');
      }
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      alert('Error al actualizar el carrito de compras');
    }
  };

  // Función para eliminar el carrito en el backend
  const handleDeleteCart = async () => {
    const userId = idUsuario();
    if (!userId) {
      alert('Error: No se encontró el ID de usuario');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/carro-compras/${userId}`, {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
        },
      });

      if (response.ok) {
        handleClearCart();
        alert('Carro de compras eliminado correctamente');
      } else {
        alert('Hubo un problema al eliminar el carrito de compras');
      }
    } catch (error) {
      console.error('Error al borrar el carrito:', error);
      alert('Error al borrar el carrito de compras');
    }
  };

  // Función para eliminar un producto del carrito
  const handleRemoveFromCart = async (productId: number) => {
    dispatch(removeFromCart(productId)); 
    await handleUpdateCart(cartItems); 
  };

  // Función para incrementar la cantidad de un producto
  const handleIncrement = async (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: 1 })); 
    await handleUpdateCart(cartItems); 
  };

  // Función para decrementar la cantidad de un producto
  const handleDecrement = async (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: -1 })); 
    await handleUpdateCart(cartItems); 
  };

  // Función para vaciar el carrito
  const handleClearCart = () => {
    dispatch(clearCart()); 
  };

 
  // Función para abrir el modal de pago
  const handleOpenModal = () => {
    setIsModalOpen(true); 
  };

  // Función para cerrar el modal de pago
  const handleCloseModal = () => {
    setIsModalOpen(false); 
    setIsPurchaseCompleted(false); 
  };

  // Función para finalizar la compra
  const handleFinalizePurchase = async () => {
    setLoading(true); 
    setError(null); 

    setPurchasedItems(groupedItems); 
    setPurchaseTotal(discountedTotal); 

    try {
      const response = await finalizePurchaseRequest(cartItems); 
      console.log('Compra finalizada con éxito: HTTP statuscode ' + response.statusCode);
      handleClearCart();
      setIsPurchaseCompleted(true);
    } catch (error) {
      setError('Hubo un problema al finalizar la compra. Por favor, inténtalo nuevamente.'); 
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  // Agrupa los productos por ID y suma las cantidades
  const groupedItems = cartItems.reduce((acc: CartItem[], item: CartItem) => {
    const existingItem = acc.find((i: CartItem) => i.id === item.id);
    if (existingItem) {
      existingItem.cantidad += item.cantidad; 
    } else {
      acc.push({ ...item }); 
    }
    return acc;
  }, []);

  // Calcula el total del carrito antes del descuento
  const total = groupedItems.reduce((acc: number, item: CartItem) => {
    return acc + item.precio * item.cantidad; 
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
                  <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleRemoveFromCart(item.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between">
            <h5>Total: ${formattedTotal}</h5>
            <button className="btn btn-primary" onClick={handleOpenModal}>Realizar Pago</button>
          </div>
        </>
      )}

      {/* Modal */}
      <div className={`modal ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Finalizar Compra</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <div>
                <label htmlFor="coupon">Código de cupón</label>
                <input
                  type="text"
                  id="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <button className="btn btn-secondary" onClick={handleApplyCoupon}>Aplicar cupón</button>
              </div>
              <div className="mt-3">
                <h6>Total: ${formattedTotal}</h6>
                <h6>Descuento: {discount * 100}%</h6>
              </div>
              {isPurchaseCompleted && <div className="alert alert-success">¡Compra finalizada exitosamente!</div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
              <button className="btn btn-primary" onClick={handleFinalizePurchase} disabled={loading}>
                {loading ? 'Procesando...' : 'Finalizar compra'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

