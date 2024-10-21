import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/CartItem';

// Definimos la estructura del estado del carrito, que incluye un array de items
interface CartState {
  items: CartItem[];
}

const loadCartFromLocalStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('__redux__cart__');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Error al cargar el carrito desde el Local Storage:', error);
    return { items:[]};
  }
};

const initialState: CartState = loadCartFromLocalStorage();

// Creamos un slice de Redux para manejar las acciones y el estado del carrito
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Acción para añadir un producto al carrito
    addToCart(state, action: PayloadAction<CartItem>) {
      // Verificamos si el producto ya está en el carrito
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        // Si el producto ya está en el carrito, incrementamos su cantidad
        existingItem.cantidad += action.payload.cantidad;
      } else {
        // Si el producto no está en el carrito, lo agregamos con cantidad inicial de 1
        state.items.push({ ...action.payload });
      }
      saveCartToLocalStorage(state);
    },

    // Acción para eliminar un producto del carrito por su ID
    removeFromCart(state, action: PayloadAction<number>) {
      // Filtramos los items, eliminando el que coincide con el ID proporcionado
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(state);
    },

    // Acción para limpiar todos los productos del carrito
    clearCart(state) {
      // Establecemos el array de items como vacío, eliminando todos los productos
      state.items = [];
      saveCartToLocalStorage(state);
    },

    updateQuantity: (state, action) => {
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

// Función auxiliar para guardar el carrito en el Local Storage
const saveCartToLocalStorage = (state: CartState) => {
  try {
    const stateAsJson = JSON.stringify(state.items);
    localStorage.setItem('__redux__cart__', stateAsJson);
  } catch (error) {
    console.error('Error al guardar el carrito de compra', error);
  }
};

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;