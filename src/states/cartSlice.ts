import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../interfaces/CartItem';

export interface CartState {
  idUsuario: 1; 
  productos:CartItem[];
}

const loadCartFromLocalStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('__redux__cart__');
    console.log('Cargando desde el localStorage:', savedCart);
    if (!savedCart) {
      return { idUsuario: 1, productos: [] };
    }

    const parsedCart = JSON.parse(savedCart);
    if (parsedCart && typeof parsedCart === 'object' && 'idUsuario' in parsedCart && 'productos' in parsedCart) {
      return parsedCart;
    }

    return { idUsuario: 1, productos: [] };
  } catch (error) {
    console.error('Error al cargar el carrito desde el Local Storage:', error);
    return { idUsuario: 1, productos: [] };
  }
};


const saveCartToLocalStorage = (state: CartState) => {
  console.log('Estado actual del carrito antes de guardar:', state);
  try {
    const cleanState = JSON.parse(JSON.stringify(state));
    localStorage.setItem('__redux__cart__', JSON.stringify(cleanState));
    console.log('Estado guardado en localStorage:', cleanState);
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
      state.productos = state.productos.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(state);
    },

    clearCart(state) {
      console.log('Limpiando el carrito en Redux...');
      state.productos = [];
      console.log('Estado en Redux después de limpiar:', state);
      
      console.log('Eliminando carrito del LocalStorage...');
      localStorage.removeItem('__redux__cart__');
      console.log('LocalStorage después de limpiar:', localStorage.getItem('__redux__cart__'));
    },
    
    
    

    updateQuantity: (state, action: PayloadAction<{ id: number; cantidad: number }>) => {
      const { id, cantidad } = action.payload;
      const item = state.productos.find((item) => item.id === id);
    
      if (item) {
        console.log(`Actualizando cantidad del producto ${id} en Redux.`);
        item.cantidad += cantidad;
    
        if (item.cantidad <= 0) {
          console.log(`Eliminando producto ${id} del carrito porque su cantidad es 0.`);
          state.productos = state.productos.filter((product) => product.id !== id);
        }
    
        saveCartToLocalStorage(state);
        console.log('LocalStorage actualizado después de modificar cantidad.');
      } else {
        console.error(`Producto ${id} no encontrado en Redux para actualizar cantidad.`);
      }
    },
    
    
    
    
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;