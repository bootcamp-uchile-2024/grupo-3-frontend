import { Middleware } from '@reduxjs/toolkit';
import { clearCart, addToCart, removeFromCart, setCartId } from './cartSlice';

let cartCleared = false; // Bandera para bloquear la sincronización después de clearCart

const cartMiddleware: Middleware = (storeAPI) => (next) => async (action: any) => {
  next(action);

  const state = storeAPI.getState();
  const cartId = state.cart.cartId;
  const userId = state.cart.idUsuario;

  if (!userId) {
    console.error('No se puede procesar acciones del carrito porque el userId no está definido.');
    return;
  }

  // Función para obtener carrito activo
  const fetchActiveCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/carro-compras/user/${userId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        storeAPI.dispatch(setCartId(data.id));
        console.log(`cartId obtenido del backend: ${data.id}`);
        return data.id;
      } else if (response.status === 404) {
        console.log('No hay carrito activo.');
        return null;
      } else {
        console.error('Error al obtener el cartId:', await response.json());
        return null;
      }
    } catch (error) {
      console.error('Error crítico al intentar obtener el carrito activo:', error);
      return null;
    }
  };

  // Función para crear un nuevo carrito
  const createCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/carro-compras/${userId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        storeAPI.dispatch(setCartId(data.id));
        console.log(`Nuevo cartId creado: ${data.id}`);
        return data.id;
      } else {
        console.error('Error al crear un nuevo carrito:', await response.json());
        return null;
      }
    } catch (error) {
      console.error('Error crítico al intentar crear un carrito:', error);
      return null;
    }
  };

  // Manejo de limpieza del carrito
  if (action.type === clearCart.type) {
    console.log('Limpieza del carrito detectada. Eliminando del localStorage...');
    cartCleared = true;
    localStorage.removeItem('__redux__cart__');
    console.log('Carrito eliminado del localStorage.');

    const activeCartId = await fetchActiveCart();
    if (!activeCartId) {
      console.log('Creando un nuevo carrito tras limpieza...');
      await createCart();
    }
    return;
  }

  // Sincronización del carrito
  if ([addToCart.type, removeFromCart.type].includes(action.type)) {
    if (cartCleared) {
      console.log('Sincronización bloqueada debido a limpieza del carrito.');
      cartCleared = false; // Restablecer la bandera después de bloquear la sincronización
      return;
    }

    if (!cartId) {
      console.warn('cartId no está definido. Intentando obtener el carrito activo...');
      const activeCartId = await fetchActiveCart();
      if (!activeCartId) {
        console.log('Creando un nuevo carrito...');
        await createCart();
      }
      return;
    }

    try {
      const productosCarro = state.cart.productos.map((item: any) => ({
        productoId: item.id,
        cantidadProducto: item.cantidad,
      }));

      if (productosCarro.length === 0) {
        console.log('El carrito está vacío. No se realiza sincronización.');
        return;
      }

      const response = await fetch(`http://localhost:8080/carro-compras/replaceProductos/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ productosCarro }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al sincronizar productos con el backend:', errorData);
      } else {
        console.log('Productos sincronizados correctamente con el backend.');
      }
    } catch (error) {
      console.error('Error crítico al sincronizar productos:', error);
    }
  }
};

export default cartMiddleware;

















