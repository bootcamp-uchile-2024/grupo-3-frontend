# Servicios del Proyecto Ecommerce

## Descripción General

A continuación, se describen los servicios relacionados con la gestión del carrito de compras detallando la estructura de cada archivo, los estados gestionados y las acciones disponibles para interactuar con el carrito de compras.

---

## CartPage

El componente `CartPage` es responsable de mostrar los productos agregados al carrito, gestionar la cantidad de cada producto, aplicar cupones de descuento y procesar la finalización de la compra.

### Funcionalidades

- **Visualización del Carrito**: Muestra los productos agrupados por `id`, sumando la cantidad de cada ítem.
- **Incrementar/Decrementar Cantidad**: Permite ajustar la cantidad de cada producto usando los botones `+` y `-`:

```
const handleIncrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: 1 }));
  };

  const handleDecrement = (productId: number) => {
    dispatch(updateQuantity({ id: productId, cantidad: -1 }));
  };
```

- **Eliminar del Carrito**: Remueve un producto del carrito mediante un botón específico.

```
removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(state);
    },

```

- **Vaciar Carrito**: Limpia todos los productos del carrito.

```
removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(state);
    },
```

- **Aplicación de Cupones**: Ofrece un campo de texto para ingresar un cupón de descuento (válido: `bootcamp2024` con un 10% de descuento).

```
const handleApplyCoupon = () => {
    if (coupon === 'bootcamp2024') {
      setDiscount(0.1);
    } else {
      alert('Cupón inválido');
      setDiscount(0);
    }
  };
```

- **Modal de Confirmación de Compra**: Al hacer clic en "Pagar", se abre un modal que muestra un resumen de los productos antes de finalizar la compra.
- **Total con Descuento**: Calcula el total del carrito con el descuento aplicado, si es válido.

### Importante

- Despacha las acciones `updateQuantity`, `removeFromCart` y `clearCart` desde `cartSlice` para manipular el estado del carrito.
- Utiliza `useSelector` para obtener el estado del carrito desde el store y `useDispatch` para enviar acciones.

---

## CatalogPage

`CatalogPage` gestiona la visualización del catálogo de productos y permite a los usuarios agregar productos al carrito.

### Funcionalidades

- **Carga de Productos**: Realiza una petición `fetch` para obtener el catálogo de productos desde la API.

```
const fetchProducts = async () => {
    try {
      const response = await fetch('https://clon-cotiledonbackend.onrender.com/catalogo');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data: productsCatalog[] = await response.json();
      setProducts(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

```

- **Agregar al Carrito**: Al hacer clic en "Agregar al carrito", se despacha la acción `addToCart` de `cartSlice`.

```
const handleAddToCart = (product: productsCatalog) => {
    const quantity = quantities[product.id] || 1;
    dispatch(addToCart({ id: product.id, nombre: product.nombre, precio: product.precio, cantidad: quantity }));
  };
```

## cartSlice

El archivo `cartSlice` define el estado del carrito de compras y las acciones disponibles para modificarlo, utilizando `createSlice` de Redux Toolkit,.

### Estado Inicial

- `items`: Arreglo que contiene los productos del carrito, cada uno con su `id`, `name`, `price` y `quantity`.

### Acciones Disponibles

- **addToCart**: Agrega un producto al carrito o incrementa su cantidad si ya está presente.
- **removeFromCart**: Remueve un producto específico del carrito.
- **updateQuantity**: Modifica la cantidad de un producto en el carrito.
- **clearCart**: Vacía todos los productos del carrito.

```
addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        existingItem.cantidad += action.payload.cantidad;
      } else {
        state.items.push({ ...action.payload });
      }
      saveCartToLocalStorage(state);
    }
```

- `removeFromCart` elimina productos por su `id`.

```
removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(state);
    }
```

- `updateQuantity` asegura que la cantidad sea mayor a cero antes de actualizar.

```
updateQuantity: (state, action: PayloadAction<{ id: number; cantidad: number }>) => {
      const { id, cantidad } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.cantidad += cantidad;
        if (item.cantidad < 1) {
          item.cantidad = 1;
        }
      }
      saveCartToLocalStorage(state);
    }
```

- `clearCart` resetea el estado a su valor inicial (`items` vacío).

```
clearCart(state) {
      state.items = [];
      saveCartToLocalStorage(state);
    },
```

---

## store

El archivo `store.ts` configura el store de Redux para la aplicación, combinando los diferentes reducers, incluyendo `cartReducer`.

## CartItem Interface

### Descripción

La interfaz `CartItem` define la estructura de los elementos del carrito de compras, incluyendo:

- `id: number` - Identificador único del producto.
- `name: string` - Nombre del producto.
- `price: number` - Precio unitario del producto.
- `quantity: number` - Cantidad de ese producto en el carrito.

---

## Uso de LocalStorage

El `localStorage` se utiliza para almacenar de manera persistente los datos del carrito de compras en el navegador del usuario. Esto asegura que, incluso si el usuario recarga la página o cierra el navegador, los productos en el carrito se mantendrán disponibles hasta que el usuario decida eliminarlos. A continuación, se describen los aspectos clave del uso de `localStorage` en este proyecto.

### Funcionalidades

- **Almacenamiento Persistente**: Permite que el carrito de compras persista entre sesiones, mejorando la experiencia del usuario al evitar la pérdida de productos seleccionados.
- **Carga Inicial del Carrito**: Al cargar la aplicación, se verifica si hay datos en `localStorage`. Si existen, se inicializa el estado del carrito con esos datos.

### Implementación

#### Almacenamiento de Datos en LocalStorage

Cada vez que se agrega, actualiza o elimina un producto del carrito, se debe actualizar el `localStorage` para reflejar el estado actual.

```
const saveCartToLocalStorage = (cart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

addToCart: (state, action) => {
    const existingItem = state.items.find(item => item.id === action.payload.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.items.push({ ...action.payload, quantity: 1 });
    }
    saveCartToLocalStorage(state.items); // Actualiza el localStorage
},

```
