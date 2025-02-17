import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/CartItem';

export interface CartState {
  idUsuario: number;
  productos: CartItem[];
}

const loadCartFromLocalStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('__redux__cart__');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error al cargar el carrito desde localStorage:', error);
  }

  const token = localStorage.getItem('token');
  if (token) {
    try {
      const idUsuario = JSON.parse(atob(token.split('.')[1])).sub;
      return { idUsuario, productos: [] };
    } catch (error) {
      console.error('Error al procesar el token de usuario:', error);
    }
  }

  return { idUsuario: 0, productos: [] };
};

const saveCartToLocalStorage = (state: CartState) => {
  try {
    localStorage.setItem('__redux__cart__', JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el carrito en localStorage:', error);
  }
};

const initialState: CartState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.productos.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.cantidad = action.payload.cantidad;
      } else {
        state.productos.push({ ...action.payload });
      }
      saveCartToLocalStorage(state);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.productos = state.productos.filter((item) => item.id !== action.payload);
      saveCartToLocalStorage(state);
    },
    clearCart(state) {
      state.productos = [];
      saveCartToLocalStorage(state);
    },
    updateQuantity(state, action: PayloadAction<{ id: number; cantidad: number }>) {
      const { id, cantidad } = action.payload;
      const item = state.productos.find((item) => item.id === id);
      if (item) {
        item.cantidad += cantidad;
        if (item.cantidad <= 0) {
          state.productos = state.productos.filter((product) => product.id !== id);
        }
        saveCartToLocalStorage(state);
      }
    },
    updateUserId(state, action: PayloadAction<number>) {
      state.idUsuario = action.payload;
      saveCartToLocalStorage(state);
    },
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.productos = action.payload;
      saveCartToLocalStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity, updateUserId, setCart } = cartSlice.actions;

export default cartSlice.reducer;
