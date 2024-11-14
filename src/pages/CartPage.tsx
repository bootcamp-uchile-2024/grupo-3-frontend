import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart, updateQuantity } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from "../interfaces/CartItem";

const CartPage: React.FC = () => {
 
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.productos as CartItem[]);

  // Estados locales para controlar el comportamiento de la UI
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false); 
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

  // Función para aplicar un cupón de descuento
  const handleApplyCoupon = () => {
    if (coupon === 'bootcamp2024') {
      setDiscount(0.1); 
    } else {
      alert('Cupón inválido.');
      setDiscount(0); 
    }
  };

  // Función para crear un carrito de compras en el backend
  const handleCreateCart = async () => {
    const idUsuario = idUsuario(); // Obtener el ID de usuario de forma dinámica
    if (!idUsuario) {
      alert('Error: No se encontró el ID de usuario');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/carro-compras/${idUsuario}`, {
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
    const idUsuario = idUsuario();
    if (!idUsuario) {
      alert('Error: No se encontró el ID de usuario');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/carro-compras/${idUsuario}`, {
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
    const idUsuario = idUsuario();
    if (!idUsuario) {
      alert('Error: No se encontró el ID de usuario');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/carro-compras/${idUsuario}`, {
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
          {isModalOpen && (
            <div className="modal show d-block" tabIndex={-1}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Pagar</h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                  </div>
                  <div className="modal-body">
                    <p>Total a pagar: ${formattedTotal}</p>
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Ingresa tu cupón"
                    />
                    <button className="btn btn-info ms-2" onClick={handleApplyCoupon}>Aplicar Cupón</button>
                    <button className="btn btn-primary ms-2" onClick={handleFinalizePurchase}>Finalizar Compra</button>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
