import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart, updateQuantity } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items as CartItem[]);

  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupon, setCoupon] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  const handleApplyCoupon = () => {
    if (coupon === 'bootcamp2024') {
      setDiscount(0.1); // 10% de descuento
    } else {
      alert('Cupón inválido');
      setDiscount(0);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: 1 }));
  };

  const handleDecrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: -1 }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFinalizePurchase = () => {
    alert('Compra finalizada');
    handleClearCart();
    handleCloseModal();
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
          <button onClick={handleOpenModal}>Pagar</button>
        </>
      )}

      {/* Modal para el resumen del pedido */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2>Resumen del Pedido</h2>
            <span style={{ marginRight: '5px' }}>Aplicar cupón de descuento?</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              
            {/* SVG imagen cupón */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 5l0 2"></path>
                <path d="M15 11l0 2"></path>
                <path d="M15 17l0 2"></path>
                <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2"></path>
              </svg>

              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Ingresa tu cupón"
                style={{ padding: '5px', marginRight: '5px' }}
              />
              
              <button onClick={handleApplyCoupon} style={{ marginLeft: '5px' }}>Aplicar</button>
            </div>
            <ul>
              {groupedItems.map((item: CartItem) => (
                <li key={item.id}>
                  <span>{item.nombre}</span>
                  <span> x {item.cantidad}</span>
                  <span> - ${item.precio * item.cantidad}</span>
                </li>
              ))}
            </ul>
            <h3>Total: ${formattedTotal}</h3>
            <button onClick={handleCloseModal}>Cancelar</button>
            <button onClick={handleFinalizePurchase}>Finalizar Compra</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;




