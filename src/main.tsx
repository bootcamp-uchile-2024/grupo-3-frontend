import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Provider } from 'react-redux'; 
import store from './states/store.ts'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> {/* Envuelve el App con Provider y pasa el store */}
      <App />
    </Provider>
  </StrictMode>,
);

