import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Configura la tienda (store) de Redux
const store = configureStore({
  reducer: {
    cart: cartReducer, // Asocia el reducer del carrito bajo la propiedad 'cart'
  },
});

// Exporta el tipo RootState
export type RootState = ReturnType<typeof store.getState>;

export default store;