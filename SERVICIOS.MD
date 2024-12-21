# Servicios del E-commerce PlantAI


#  Compra de Productos 
Este servicio gestiona el flujo de compra de productos, desde la gestión del carrito de compras hasta la finalización del pedido. Integra la lógica del frontend con los endpoints del backend para manipular datos del carrito, calcular totales y realizar compras.
## Componentes Principales
#### 1. CartPage: 
Página principal del carrito donde los usuarios pueden ver, agregar, eliminar y modificar productos en su carrito de compras.
#### 2. Estados Globales y Locales: 
Se utilizan estados globales (Redux) y locales (useState) para la manipulación de datos y la interfaz. 
- **cartSlice**: Acciones para el manejo del carrito (añadir, eliminar, actualizar).

#### 3. Integración con Backend: 
Consume endpoints REST para sincronizar el carrito y procesar pedidos.

## Uso de Servicios
#### 1. Obtener Carrito Activo
- **Descripción**: Verifica si existe un carrito activo para el usuario actual. Si no existe, devuelve un error 404.
- **Endpoint**: GET /carro-compras/user/{userId}
- **Uso del código**:
```typescript
const fetchActiveCart = async (): Promise<number | null> => {
  const response = await fetch(`${API_BASE_URL}/carro-compras/user/${userId}`);
  if (response.ok) {
    const data = await response.json();
    return data.id;
  }
  return null;
};
```
#### 2. Crear un Nuevo Carrito
- **Descripción**:  Genera un nuevo carrito para el usuario actual.
- **Endpoint**: POST /carro-compras/{userId}
- **Uso del código**:
```typescript
const createCart = async () => {
  const response = await fetch(`${API_BASE_URL}/carro-compras/${userId}`, { method: 'POST' });
  const data = await response.json();
  setCartId(data.id);
};
```
#### 3. Agregar Producto al Carrito
- **Descripción**:  Agrega un producto al carrito existente con una cantidad específica.
- **Endpoint**: POST /carro-compras/addproducto/{cartId}
- **Uso del código**:
```typescript
const addProductToCart = async (cartId: number, productId: number, quantity: number) => {
  const response = await fetch(`${API_BASE_URL}/carro-compras/addproducto/${cartId}`, {
    method: 'POST',
    body: JSON.stringify({ productoId: productId, cantidadProducto: quantity }),
  });
};
```
#### 4. Eliminar Producto del Carrito
- **Descripción**: Elimina un producto del carrito basado en su ID.
- **Endpoint**: DELETE /carro-compras/removeProducto/{cartId}/{productId}
- **Uso del código**:
```typescript
const handleRemoveProductFromCart = async (productId: number) => {
  await fetch(`${API_BASE_URL}/carro-compras/removeProducto/${cartId}/${productId}`, { method: 'DELETE' });
};
```
#### 5. Actualizar Productos en el Carrito
- **Descripción**:Sincroniza los productos en el carrito con el backend.
- **Endpoint**: PUT /carro-compras/replaceProductos/{cartId}
- **Uso del código**:
```typescript
const replaceCartProducts = async () => {
  await fetch(`${API_BASE_URL}/carro-compras/replaceProductos/${cartId}`, {
    method: 'PUT',
    body: JSON.stringify({
      productosCarro: cartItems.map((item) => ({
        productoId: item.id,
        cantidadProducto: item.cantidad,
      })),
    }),
  });
};
```
#### 6. Finalizar Compra
- **Descripción**:Procesa la compra de los productos en el carrito y vacía el carrito en caso de éxito.
- **Endpoint**: POST /carro-compras/finalizar
- **Uso del código**:
```typescript
const handleFinalizePurchase = async () => {
  const response = await finalizePurchaseRequest(cartItems);
  if (response.statusCode === 200) {
    handleClearCart();
  }
};
```
#### 7. Vaciar el Carrito
- **Descripción**:Limpia el contenido del carrito del usuario.
- **Endpoint**: PUT /carro-compras/replaceProductos/{cartId}
- **Uso del código**:
```typescript
const handleClearCart = async () => {
  await fetch(`${API_BASE_URL}/carro-compras/replaceProductos/${cartId}`, {
    method: 'PUT',
    body: JSON.stringify({ productosCarro: [] }),
  });
};

```


# **Catálogo de Productos**

Este servicio gestiona la visualización, filtrado y paginación de productos en el catálogo. Permite a los usuarios buscar productos, aplicar filtros, modificar cantidades y agregar productos al carrito de compras. Integra la lógica del frontend con los servicios del backend para garantizar una experiencia de usuario dinámica y eficiente.

## **Componentes Principales**

### **1. Página de Catálogo (CatalogPage):**
Página principal del catálogo donde los usuarios pueden navegar por los productos disponibles, aplicar filtros, ordenar y gestionar la paginación.

### **2. Gestión de Estados:**
Se emplean estados globales (Redux) y locales (useState) para sincronizar datos y gestionar la interfaz.
- **`cartSlice`**: Acciones para el manejo del carrito (agregar productos, actualizar cantidades, etc.).
- **`filters`**: Estado local que define los filtros activos para el catálogo (precio, puntuación, tipo de planta, etc.).

### **3. Integración con Backend:**
Consume endpoints RESTful para recuperar productos, gestionar filtros y sincronizar datos con el servidor.

---

## **Uso de Servicios**

### **1. Obtener Productos del Catálogo**
- **Descripción**: Recupera los productos del catálogo desde el backend según los filtros activos, la búsqueda y la paginación.
- **Endpoint**: `GET /catalogo`  
  Parámetros opcionales:  
  - `search`: Término de búsqueda.  
  - `minPrecio` y `maxPrecio`: Rango de precios.  
  - `puntuacion`: Filtro por puntuación mínima.  
  - `page` y `pageSize`: Paginación.  
  - Otros filtros relacionados con atributos de las plantas.
- **Uso del Código**:
  ```typescript
  const fetchProducts = useCallback(async () => {
    let url = 'http://localhost:8080/catalogo';
    const queryParams = new URLSearchParams();

    if (filters.minPrecio) queryParams.append('minPrecio', filters.minPrecio.toString());
    if (filters.maxPrecio) queryParams.append('maxPrecio', filters.maxPrecio.toString());
    if (filters.puntuacion) queryParams.append('puntuacion', filters.puntuacion.toString());
    queryParams.append('page', currentPage.toString());
    queryParams.append('pageSize', pageSize.toString());

    url += `?${queryParams.toString()}`;

    const response = await fetch(url, { method: 'GET' });
    if (response.ok) {
      const data = await response.json();
      setProducts(data.data);
      setTotalPages(Math.ceil(data.totalItems / pageSize));
    } else {
      throw new Error('Error al cargar los productos');
    }
  }, [filters, currentPage, pageSize]);
  ```

### **2. Filtrar Productos**
- **Descripción**: Aplica diferentes filtros al catálogo para refinar los resultados mostrados al usuario.
- **Endpoint**: `GET /catalogo`  
  Parámetros adicionales:  
  - `petFriendly`: Filtra productos aptos para mascotas.  
  - `idToleranciaTemperatura`, `idIluminacion`, `idTipoRiego`, `idTamano`: Filtros por atributos específicos de las plantas.  
  - `ordenarPor` y `orden`: Ordena los resultados.
- **Uso del Código**:
  ```typescript
  const handleFilterChange = (newFilters: CatalogFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };
  ```

### **3. Agregar Productos al Carrito**
- **Descripción**: Agrega un producto seleccionado al carrito del usuario y sincroniza la acción con el estado global.
- **Endpoint**: `POST /carro-compras/addproducto/{cartId}`
- **Uso del Código**:
  ```typescript
  const handleAddToCart = (product: productsCatalog) => {
    const imagePath = product.imagenes?.[0]?.ruta ?? '/estaticos/default-image.jpg';
    dispatch(
      addToCart({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: imagePath,
        cantidad: 1,
        stock: product.stock,
      })
    );
    setShowOffcanvas(true);
  };
  ```

### **4. Cambiar Cantidad de Productos**
- **Descripción**: Incrementa o decrementa la cantidad de un producto en el carrito del usuario.
- **Endpoint**: `PUT /carro-compras/updateCantidad/{cartId}/{productId}`
- **Uso del Código**:
  ```typescript
  const handleIncrementQuantity = (product: productsCatalog) => {
    if (product.stock > (quantities[product.id] || 1)) {
      setQuantities((prev) => ({
        ...prev,
        [product.id]: (quantities[product.id] || 1) + 1,
      }));
    } else {
      alert(`No puedes agregar más de ${product.stock} unidades.`);
    }
  };
  ```

### **5. Paginación**
- **Descripción**: Controla la navegación entre páginas del catálogo.
- **Endpoint**: `GET /catalogo?page={page}&pageSize={pageSize}`
- **Uso del Código**:
  ```typescript
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  ```
# Detalle del Producto

## Descripción General

El componente **ProductDetailPage** es una página React que muestra información detallada sobre un producto específico. Este componente permite:
- Ver imágenes del producto y sus características.
- Seleccionar cantidad para la compra.
- Agregar el producto al carrito de compras.
- Elegir entre envío a domicilio o retiro en tienda.
- Comprar directamente desde la página de detalle.

---

## Tecnologías y Librerías Utilizadas

- **React**: Biblioteca principal para la creación del componente.
- **Redux**: Gestión de estado global (para el carrito de compras).
- **React Router**: Manejo de rutas y parámetros.
- **Bootstrap**: Estilos y componentes predefinidos.
- **Icons Bootstrap**: Para iconografía interactiva.

---

## Estructura del Código

### Dependencias Importadas

```javascript
import '../styles/ProductDetailStyle.css';
import '../styles/Offcanvas.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice';
import { Button, Card, Col, Container, Row, Form, Offcanvas } from 'react-bootstrap';
import { CartPlus, CaretDown } from 'react-bootstrap-icons';
```

Estas dependencias incluyen estilos CSS, funciones y componentes React necesarios para la implementación.

### Estado y Hooks

- **Estados**: Manejan datos como producto, cantidad seleccionada, error, y controlan el estado del carrito.
- **Hooks**: Se usan `useParams`, `useNavigate`, `useDispatch` y `useEffect` para manejar datos, rutas y efectos secundarios.

```javascript
const { id } = useParams<{ id: string }>();
const [product, setProduct] = useState<productsCatalog | null>(null);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [quantity, setQuantity] = useState<number>(1);
// Otros estados omitidos para brevedad
```

### Funcionalidades Clave

1. **Carga de Producto desde API**:
    - Llama a una API para obtener detalles del producto.
    - Muestra una imagen predeterminada si no hay imágenes disponibles.

    ```javascript
    useEffect(() => {
      const getProduct = async () => {
        try {
          const response = await fetch(`http://localhost:8080/productos/${id}`);
          const productJson = await response.json();
          setProduct(productJson);
        } catch (error) {
          setError('Hubo un error al obtener el producto');
        } finally {
          setLoading(false);
        }
      };
      getProduct();
    }, [id]);
    ```

2. **Agregar al Carrito**:
    - Verifica si la cantidad seleccionada es válida antes de agregar el producto.
    - Despacha la acción `addToCart` del slice de Redux.

    ```javascript
    const handleAddToCart = (product) => {
      if (quantity > product.stock) {
        alert(`Solo hay ${product.stock} unidades disponibles.`);
        return;
      }
      dispatch(addToCart({
        id: product.id,
        nombre: product.nombre,
        // Otros atributos omitidos
      }));
    };
    ```

3. **Cambiar Imágenes y Controlar Cantidad**:
    - Cambia la imagen principal al hacer clic en una miniatura.
    - Incrementa o decrementa la cantidad seleccionada respetando el stock disponible.

4. **Visualización de Detalles y Características**:
    - Las características del producto se despliegan de manera interactiva.

    ```javascript
    const toggleSection = (section) => {
      setOpenSection(prev => (prev === section ? null : section));
    };
    ```
# Servicio Inicio de sesión
## Description
Permite a los usuarios introducir sus credenciales, verifica la información con usuarios predefinidos y los redirige en función de sus roles. Este componente está construido con React e integra React Router para la navegación.

---
## Características principales
1. **Validación de usuario**:
   - Compara las credenciales de entrada con una lista predefinida de usuarios.
   - Muestra los mensajes de error correspondientes para un nombre de usuario o una contraseña no válidos.
2. **Navegación basada en roles**:
   - Redirige a los usuarios a '/user-management' si tienen privilegios de administrador.
   - Redirige a los usuarios habituales a la página de inicio ('/').
3. **Integración de almacenamiento local**:
   - Almacena los datos del usuario en 'localStorage' al iniciar sesión correctamente.
```tsx
import React from 'react';
import LoginForm from './LoginForm';

const App = () => {
  const handleLogin = (username, role) => {
    console.log(`Logged in as ${username} with role ${role}`);
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default App;
```

---

## Explicación de código

### User Data
```tsx
const users = [
  { username: 'administrador', password: 'administrador', roles: ['admin-1'] },
  { username: 'usuario', password: 'usuario', roles: ['user-1'] }
];
```
- Contiene credenciales.

### Lógica Login
```tsx
const login = (user: ILogin): boolean => {
  const foundUser = users.find(u => u.username === user.username);

  if (!foundUser) {
    setErrors(prev => ({ ...prev, usernameError: 'Nombre de usuario incorrecto' }));
    return false;
  }

  if (foundUser.password !== user.password) {
    setErrors(prev => ({ ...prev, passwordError: 'Contraseña incorrecta' }));
    return false;
  }

  const userResponse: ILogin = {
    ...user,
    roles: foundUser.roles
  };

  const datosUsuario = JSON.stringify(userResponse);
  localStorage.setItem('user', datosUsuario);
  return true;
};
```
- Valida las credenciales de un usuario y da un error si es invalido. 
- Almaceda la data de usario en `localStorage`.