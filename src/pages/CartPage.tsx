import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart, updateQuantity } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items as CartItem[]); // Obtiene los productos del carrito

  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart(productId)); // Llama a la acción para eliminar un producto
  };

  const handleIncrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: 1 })); // Aumenta la cantidad en 1
  };

  const handleDecrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: -1 })); // Disminuye la cantidad en 1
  };

  const handleClearCart = () => {
    dispatch(clearCart()); // Vacía el carrito
  };

  // Agrupa los productos por ID y suma sus cantidades
  const groupedItems = cartItems.reduce((acc: CartItem[], item: CartItem ) => {
    const existingItem = acc.find((i: CartItem) => i.id === item.id);
    if (existingItem) {
      existingItem.cantidad += item.cantidad; // Aumenta la cantidad si el producto ya está en el carrito
    } else {
      acc.push({ ...item }); // Si no existe, lo agrega
    }
    return acc;
  }, []);

  // Calcula el total de los productos en el carrito
  const total = groupedItems.reduce((acc: number, item: CartItem) => {
    return acc + item.precio * item.cantidad; // Multiplica el precio por la cantidad y suma
  }, 0);

  // Formatea el total según la convención chilena
  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(total);

  return (
    <div className="cart-container">
      <h1>Carrito de Compras</h1>
      {groupedItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {groupedItems.map((item: CartItem) => (
              <li key={item.id}>
                <span>{item.nombre}</span>
                <span> ${item.precio}</span>
                <div>
                  <button onClick={() => handleDecrement(item.id)} disabled={item.cantidad === 1}>-</button>
                  <span> {item.cantidad}</span>
                  <button onClick={() => handleIncrement(item.id)}>+</button>
                  <button onClick={() => handleRemoveFromCart(item.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          <h2>Total: ${formattedTotal}</h2> 
          <button onClick={handleClearCart}>Vaciar Carrito</button>
        </>
      )}
    </div>
  );
};

export default CartPage;