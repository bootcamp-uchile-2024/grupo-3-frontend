import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import counterReducer from './counterSlice';

// Configura la tienda (store) de Redux
const store = configureStore({
  reducer: {
    counter: counterReducer, 
    cart: cartReducer, // Asocia el reducer del carrito bajo la propiedad 'cart'
  },
});

// Exporta el tipo RootState
export type RootState = ReturnType<typeof store.getState>;
export type RootType = ReturnType<typeof store.getState>;
export default store;