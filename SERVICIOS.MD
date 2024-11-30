# Servicios del proyecto E-commerce PlantAI

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

- **Carga de Productos**: Realiza una petición `fetch` para obtener el catálogo de productos desde la Base de datos.

```
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/catalogo?page=${currentPage}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al cargar los productos');

      const data = await response.json();

      if (Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalPages(Math.ceil(data.totalItems / pageSize));
      } else {
        throw new Error('Datos de productos no válidos');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ha ocurrido un error desconocido');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500); 
    }
  };

```

- **Agregar al Carrito**: Al hacer clic en "Agregar al carrito", se despacha la acción `addToCart` de `cartSlice`.

```
const handleAddToCart = (product: productsCatalog) => {
    const quantity = quantities[product.id] || 1;

    if (quantity > product.cantidad) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [product.id]: `Stock insuficiente. Solo hay ${product.cantidad} unidades disponibles.`,
      }));
      return;
    }
    dispatch(addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      descripcion: product.descripcion,
      cantidad: quantity,
      unidadesVendidas: product.unidadesVendidas,
      puntuacion: product.puntuacion,
      ancho: product.ancho,
      alto: product.alto,
      largo: product.largo,
      peso: product.peso,
    }));
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      [product.id]: '',
    }));
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
  const handleAddToCart = (product: productsCatalog) => {
    const quantity = quantities[product.id] || 1;

    if (quantity > product.cantidad) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [product.id]: `Stock insuficiente. Solo hay ${product.cantidad} unidades disponibles.`,
      }));
      return;
    }
    dispatch(addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      descripcion: product.descripcion,
      cantidad: quantity,
      unidadesVendidas: product.unidadesVendidas,
      puntuacion: product.puntuacion,
      ancho: product.ancho,
      alto: product.alto,
      largo: product.largo,
      peso: product.peso,
    }));
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      [product.id]: '',
    }));
  };
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
- `nombre: string` - Nombre del producto.  
- `precio: number` - Precio unitario del producto.  
- `imagen: string` - URL de la imagen del producto.  
- `descripcion: string` - Descripción detallada del producto.  
- `cantidad: number` - Cantidad de ese producto en el carrito.  
- `unidadesVendidas: number` - Número de unidades vendidas del producto.  
- `puntuacion: number` - Puntuación promedio del producto basada en reseñas.  
- `familia?: string` - Familia botánica o categoría del producto (opcional).  
- `fotoperiodo?: string` - Requisitos de fotoperiodo para el cuidado del producto (opcional).  
- `tipoRiego?: string` - Tipo de riego recomendado para el producto (opcional).  
- `petFriendly?: boolean` - Indica si el producto es seguro para mascotas (opcional).  
- `color?: string` - Color característico del producto (opcional).  
- `ancho: number` - Ancho del producto en centímetros.  
- `alto: number` - Altura del producto en centímetros.  
- `largo: number` - Largo del producto en centímetros.  
- `peso: number` - Peso del producto en kilogramos.  

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

## Servicio Catálogo

- **Descripción**: Muestra la oferta visible para los usuarios. <br>
- **Método HTTP:** GET
- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/catalogo <br>
- **Interface utilizada:** productosDeCatalogo

## Detalles de Producto<br>

- **Descripción**: Proporciona los detalles específicos de un producto individual en el catálogo.<br>
- **Método HTTP:** GET
- **EndPoint consumido**: http://localhost:8080/catalogo?page=${currentPage}&pageSize=${pageSize} <br>
- **Interface utilizada:** productosDeCatalogo

## Lista de interfaces

**Interface**: productsCatalog

- **Descripción:** Define la estructura de los productos que se muestran en el catálogo, proporcionando los atributos clave que representan cada producto.

- **Ruta fichero DTO**: `src/interfaces/ProductsCatalog.ts` <br>

```typescript
interface productsCatalog {
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  cantidad: number;
  unidadesVendidas: number;
  puntuacion: number;
  familia: string;
  fotoperiodo: string;
  tipoRiego: string;
  petFriendly: boolean;
  color: string;
  id: number;
}
```

**Interface**: CreateProductData

- **Descripción:** Define la estructura del nuevo producto que se va a crear para luego mostrarse en el catálogo, proporcionando los atributos clave que representan cada producto.

- **Ruta fichero DTO**: `src/interfaces/CreateProductData.ts` <br>

```typescript
interface createProductData {
  nombre: string;
  precio: number;
  imagen?: string;
  descripcion: string;
  cantidad: number;
  familia: string;
  fotoperiodo: string;
  tipoRiego: string;
  petFriendly: boolean;
  color: string;
  id?: number;
}
```

**Interface**: CreateUsuarioDTO

- **Descripción:** Permite la creación de cuentas de usuario.

- **Ruta fichero DTO**: `src/interfaces/CreateUserDTO.ts` <br>

```typescript
export interface createUsuarioDTO {
  name: string;
  password: string;
  email: string;
}
```

**Interface**: CartItem

- **Descripción:** Permite agregar y agrupar los items al carrito de compra

- **Ruta fichero DTO**: `src/interfaces/CartItem.ts` <br>

```typescript
export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}
```
