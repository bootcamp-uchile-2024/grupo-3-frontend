import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import counterReducer from './counterSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer, 
    cart: cartReducer, 
  },
});

declare global {
  interface Window {
    store: typeof store;
  }
}

window.store = store;

export type RootState = ReturnType<typeof store.getState>;
export default store;
