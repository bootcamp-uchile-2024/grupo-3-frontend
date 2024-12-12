import { Dispatch } from 'redux';
import { CartItem } from '../interfaces/CartItem';
import { removeFromCart, clearCart, addToCart } from '../states/cartSlice';

const API_BASE_URL = import.meta.env.VITE_URL_ENDPOINT_BACKEND || 'http://localhost:8080';

export const initializeCart = async (
  userId: number,
  setCartId: (id: number | null) => void,
  dispatch: any
): Promise<void> => {
  try {
    console.log('Inicializando carrito...');
    const activeCartId = await fetchActiveCart(userId, setCartId);

    if (activeCartId) {
      console.log(`Carrito activo detectado con ID ${activeCartId}.`);
      const savedCartItems = localStorage.getItem('__redux__cart__');

      if (savedCartItems) {
        console.log('Datos encontrados en localStorage:', savedCartItems); // Nuevo log
        const parsedCart = JSON.parse(savedCartItems);

        if (parsedCart && Array.isArray(parsedCart.productos) && parsedCart.productos.length > 0) {
          console.log('Sincronizando carrito desde el localStorage...');
          dispatch(clearCart());
          parsedCart.productos.forEach((item: CartItem) => {
            console.log('Añadiendo producto desde localStorage:', item); // Nuevo log
            dispatch(addToCart(item));
          });
        } else {
          console.log('Carrito vacío en localStorage. Eliminando...');
          localStorage.removeItem('__redux__cart__');
          dispatch(clearCart());
        }
      }
    } else {
      console.log('No hay carrito activo. Creando uno nuevo...');
      await createCart(userId, setCartId, null);
    }
  } catch (error) {
    console.error('Error crítico al inicializar el carrito:', error);
  }
};


export const fetchActiveCart = async (
  userId: number,
  setCartId: (id: number | null) => void
): Promise<number | null> => {
  try {
    console.log(`Verificando carrito activo para el usuario ${userId}`);
    
    const response = await fetch(`${API_BASE_URL}/carro-compras/user/${userId}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();

      if (data && typeof data === 'object' && data.id) {
        console.log('Carrito activo encontrado:', data);
        setCartId(data.id);
        return data.id;
      } else {
        console.warn('El backend devolvió una respuesta inválida para el carrito activo:', data);
        setCartId(null);
        return null;
      }
    } else if (response.status === 404) {
      console.log('No hay carrito activo para este usuario.');
      setCartId(null);
      return null;
    } else {
      console.error(`Error HTTP al verificar el carrito: ${response.status}`);
      throw new Error(`Error HTTP: ${response.status}`);
    }
  } catch (error: unknown) {
    console.error('Error crítico al verificar el carrito activo:', error);
    setCartId(null); // Asegurar que el estado refleje la ausencia de un carrito
    return null;
  }
};


export const createCart = async (
  userId: number,
  setCartId: (id: number | null) => void,
  cartId: number | null
): Promise<{ id: number } | null> => {
  try {
    if (cartId) {
      console.log(`Ya existe un carrito activo con ID ${cartId}. No se creará uno nuevo.`);
      return { id: cartId }; // Retorna el carrito existente
    }

    console.log(`Creando un nuevo carrito para el usuario ${userId}`);
    const response = await fetch(`${API_BASE_URL}/carro-compras/${userId}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al crear el carrito:', errorData);
      alert(errorData.message || 'No se pudo crear el carrito debido a un error en el servidor. Contacta soporte.');
      return null; // Retorna null en caso de error
    }

    const data = await response.json();
    setCartId(data.id); // Actualiza el estado del carrito con el nuevo ID
    console.log('Carrito creado con éxito:', data);
    return { id: data.id }; // Retorna el nuevo carrito creado
  } catch (error: unknown) {
    console.error('Error crítico al intentar crear un carrito:', error);
    alert('Hubo un problema al crear el carrito. Inténtalo nuevamente más tarde.');
    return null; // Retorna null en caso de error crítico
  }
};


export const handleRemoveProductFromCart = async (
  
  cartId: number | null,
  productId: number,
  dispatch: Dispatch
): Promise<void> => {
  if (!cartId) {
    alert('No hay un carrito asociado para realizar esta acción.');
    return;
  }

  if (!window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/carro-compras/removeProducto/${cartId}/${productId}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || 'Hubo un problema al eliminar el producto.');
      return;
    }

    dispatch(removeFromCart(productId));
    alert('El producto ha sido eliminado del carrito.');
  } catch (error) {
    console.error('Error al intentar eliminar el producto:', error);
    alert('No se pudo eliminar el producto. Por favor, inténtalo nuevamente.');
  }
  
};

export const replaceCartProducts = async (
  cartId: number | null,
  cartItems: CartItem[]
): Promise<void> => {
  if (!cartId) {
    console.error('No se puede actualizar el carrito porque no existe un ID de carrito.');
    return;
  }

  try {
    console.log(`Actualizando productos en el carrito con ID ${cartId}`);
    const response = await fetch(`${API_BASE_URL}/carro-compras/replaceProductos/${cartId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productosCarro: cartItems.map((item) => ({
          productoId: item.id,
          cantidadProducto: item.cantidad,
          nombre: item.nombre || '',
          precio: item.precio || 0,
          imagen: item.imagen || '',
          descripcion: item.descripcion || '',
          unidadesVendidas: item.unidadesVendidas || 0,
          puntuacion: item.puntuacion || 0,
          ancho: item.ancho || 0,
          alto: item.alto || 0,
          largo: item.largo || 0,
          peso: item.peso || 0,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    console.log('Productos del carrito actualizados en el backend.');
  } catch (error: unknown) {
    console.error('Error al actualizar el carrito en el backend:', error);
    throw error;
  }
};