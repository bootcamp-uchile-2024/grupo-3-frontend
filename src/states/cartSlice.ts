import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/CartItem';

export interface CartState {
  idUsuario: 1; 
  productos:CartItem[];
}
// Cargar carrito desde el localStorage
const loadCartFromLocalStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('__redux__cart__');
    console.log('Cargando desde localStorage:', savedCart);
    return savedCart ? JSON.parse(savedCart) : { idUsuario: 1, productos: [] }; 
  } catch (error) {
    console.error('Error al cargar el carrito desde el Local Storage:', error);
    return { idUsuario: 1, productos: [] }; 
  }
};

// Guardar carrito en el localStorage
const saveCartToLocalStorage = (state: CartState) => {
  try {
    console.log('Guardando en localStorage:', state);
    const stateAsJson = JSON.stringify(state);
    localStorage.setItem('__redux__cart__', stateAsJson);
  } catch (error) {
    console.error('Error al guardar el carrito de compra', error);
  }
};

// Estado inicial
const initialState: CartState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.productos.find(item => item.id === action.payload.id); // Cambiado de items a productos

      if (existingItem) {
        existingItem.cantidad += action.payload.cantidad;
      } else {
        state.productos.push({ ...action.payload }); // Cambiado de items a productos
      }
      saveCartToLocalStorage(state);
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.productos = state.productos.filter(item => item.id !== action.payload); // Cambiado de items a productos
      saveCartToLocalStorage(state);
    },

    clearCart(state) {
      state.productos = []; // Cambiado de items a productos
      saveCartToLocalStorage(state);
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; cantidad: number }>) => {
      const { id, cantidad } = action.payload;
      const item = state.productos.find(item => item.id === id); // Cambiado de items a productos
      if (item) {
        item.cantidad += cantidad;
        if (item.cantidad < 1) {
          item.cantidad = 1; // Mantiene la cantidad mínima en 1
        }
      }
      saveCartToLocalStorage(state);
    },
  },
});

// Exportar acciones y reducer
export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;