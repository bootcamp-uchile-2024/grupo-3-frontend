import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart, updateQuantity } from '../states/cartSlice';
import { RootState } from '../states/store';
import { CartItem } from '../interfaces/CartItem';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items as CartItem[]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupon, setCoupon] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);

  const handleApplyCoupon = () => {
    if (coupon === 'bootcamp2024') {
      setDiscount(0.1);
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
    <div className="container mt-4">
      <h1>Carrito de Compras</h1>
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
        </>
      )}

      {/* Modal para el resumen del pedido */}
      {isModalOpen && (
        <div className="modal show" style={{ display: 'block' }} aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resumen del Pedido</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <span>Aplicar cupón de descuento?</span>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Ingresa tu cupón"
                    className="form-control"
                  />
                  <button className="btn btn-secondary" onClick={handleApplyCoupon}>Aplicar</button>
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
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleFinalizePurchase}>Finalizar Compra</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
