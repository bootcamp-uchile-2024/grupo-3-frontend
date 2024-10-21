import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/CartItem';

interface CartState {
  items: CartItem[];
}

const loadCartFromLocalStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('__redux__cart__');
    console.log('Cargando desde localStorage:', savedCart);
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Error al cargar el carrito desde el Local Storage:', error);
    return { items: [] };
  }
};

const saveCartToLocalStorage = (state: CartState) => {
  try {
    console.log('Guardando en localStorage:', state);
    const stateAsJson = JSON.stringify(state);
    localStorage.setItem('__redux__cart__', stateAsJson);
  } catch (error) {
    console.error('Error al guardar el carrito de compra', error);
  }
};

const initialState: CartState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        existingItem.cantidad += action.payload.cantidad;
      } else {
        state.items.push({ ...action.payload });
      }
      saveCartToLocalStorage(state);
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(state);
    },

    clearCart(state) {
      state.items = [];
      saveCartToLocalStorage(state);
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; cantidad: number }>) => {
      const { id, cantidad } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.cantidad += cantidad;
        if (item.cantidad < 1) {
          item.cantidad = 1;
        }
      }
      saveCartToLocalStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
