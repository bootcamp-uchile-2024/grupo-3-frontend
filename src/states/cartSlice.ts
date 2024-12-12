import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/CartItem';

export interface CartState {
  idUsuario: number; 
  productos: CartItem[]; 
  cartId: number | null; 
}

const loadCartFromLocalStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('__redux__cart__'); 
    if (!savedCart) {
      return { idUsuario: 2, productos: [], cartId: null }; 
    }

    const parsedCart = JSON.parse(savedCart);
    if (
      parsedCart &&
      typeof parsedCart === 'object' &&
      'idUsuario' in parsedCart &&
      'productos' in parsedCart
    ) {
      return parsedCart; 
    }

    return { idUsuario: 2, productos: [], cartId: null };
  } catch (error) {
    console.error('Error al cargar el carrito desde el Local Storage:', error);
    return { idUsuario: 2, productos: [], cartId: null }; 
  }
};

const saveCartToLocalStorage = (state: CartState) => {
  try {
    const cleanState = JSON.parse(JSON.stringify(state)); 
    localStorage.setItem('__redux__cart__', JSON.stringify(cleanState)); 
  } catch (error) {
    console.error('Error al guardar el carrito de compras en localStorage:', error);
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
        existingItem.cantidad += action.payload.cantidad; 
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
      console.log('Limpiando el carrito en Redux...');
      state.productos = [];
      state.cartId = null; 
      localStorage.removeItem('__redux__cart__'); 
      console.log('Carrito limpio en Redux y localStorage.');
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

    setCartId(state, action: PayloadAction<number | null>) {
      state.cartId = action.payload;
      saveCartToLocalStorage(state); 
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity, setCartId } =
  cartSlice.actions;
export default cartSlice.reducer;
