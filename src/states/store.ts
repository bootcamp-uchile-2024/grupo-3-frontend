import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import counterReducer from './counterSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer, 
    cart: cartReducer, 
  },
});

(window as any).store = store;

export type RootState = ReturnType<typeof store.getState>;
export default store;