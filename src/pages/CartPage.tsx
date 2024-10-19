import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../states/cartSlice'; 
import { RootState } from '../states/store';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items); // Obtiene los productos del carrito

  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart(productId)); // Llama a la acción para eliminar un producto
  };

  // Agrupa los productos por ID y suma sus cantidades
  const groupedItems = cartItems.reduce((acc: any, item: any) => {
    const existingItem = acc.find((i: any) => i.id === item.id);
    if (existingItem) {
      existingItem.cantidad += item.cantidad; // Aumenta la cantidad si el producto ya está en el carrito
    } else {
      acc.push({ ...item }); // Si no existe, lo agrega
    }
    return acc;
  }, []);

  // Calcula el total de los productos en el carrito
  const total = groupedItems.reduce((acc: number, item: any) => {
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
            {groupedItems.map((item: any) => (
              <li key={item.id}>
                <span>{item.nombre}</span>
                <span> - ${item.precio} x {item.cantidad}</span> {/* Muestra la cantidad */}
                <button onClick={() => handleRemoveFromCart(item.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <h2>Total: ${formattedTotal}</h2> {/* Muestra el total formateado */}
        </>
      )}
    </div>
  );
};

export default CartPage;