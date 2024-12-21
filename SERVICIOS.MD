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

# Gestión de Usuarios en la Plataforma

Sistema de administración de usuarios, donde se gestionan las operaciones CRUD (crear, leer, actualizar, eliminar) de los usuarios. Los administradores pueden ver, editar y eliminar usuarios, y también se incluye la funcionalidad de paginación y búsqueda.

## Componentes Principales

#### 1. **UserManagement**:
   - Es el componente principal que gestiona la interfaz de administración de usuarios. 
   - Contiene la lógica para la paginación, búsqueda, y acciones como editar, eliminar y visualizar detalles de los usuarios.

#### 2. **UserCreateForm**:
   - Componente utilizado para crear nuevos usuarios (no se muestra en este código, pero se menciona como importado).

#### 3. **CardUser**:
   - Muestra una tarjeta con la información básica de un usuario (también importado pero no se muestra en el código proporcionado).

#### 4. **UserTable**:
   - Muestra la lista de usuarios en formato tabla (importado pero no se detalla en este código).

#### 5. **CustomPagination**:
   - Componente encargado de la paginación de la lista de usuarios, permitiendo navegar entre las páginas.

#### 6. **AdminSideBar**:
   - Barra lateral que probablemente contiene enlaces y opciones de navegación para la administración (importado pero no detallado en el código).

#### 7. **UserGreeting**:
   - Componente para mostrar un saludo personalizado al usuario administrador (importado pero no detallado).

## Estados

- **users**: Almacena la lista de usuarios recuperados del backend.
- **loading**: Estado booleano que indica si los datos están siendo cargados.
- **isAdmin**: Estado booleano que indica si el usuario tiene rol de administrador.
- **editingUser**: Usuario que se encuentra siendo editado.
- **selectedUser**: Usuario seleccionado para visualización o modificación.
- **error**: Estado para manejar errores y mostrar mensajes en la interfaz.
- **currentPage**: Página actual en la paginación de usuarios.
- **showModal**: Determina si el modal de confirmación de acción está visible o no.
- **modalAction**: Define si la acción en el modal es de "modificar" o "eliminar".
- **usersPerPage**: Número de usuarios que se muestran por página.
- **searchId, searchName, searchUsername, searchEmail**: Variables de estado para almacenar los términos de búsqueda.

## Funciones y Lógica

### 1. **handleSearchChange**
   - Función para manejar los cambios en los campos de búsqueda. Dependiendo del campo, actualiza los estados de búsqueda correspondientes.

```typescript
const handleSearchChange = (event: React.ChangeEvent<HTMLElement>, field: string) => {
  const value = (event.target as HTMLInputElement).value;
  switch (field) {
    case 'id':
      setSearchId(value);
      break;
    case 'name':
      setSearchName(value);
      break;
    case 'username':
      setSearchUsername(value);
      break;
    case 'email':
      setSearchEmail(value);
      break;
    default:
      break;
  }
};
```
### 2. **handleSearchSubmit**
- Función que se ejecuta cuando se envía el formulario de búsqueda. Filtra los usuarios según los criterios de búsqueda (ID, nombre, nombre de usuario, email) y establece el primer usuario coincidente como selectedUser.

```typescript
const handleSearchSubmit = () => {
  const filteredUsers = users.filter((user) => {
    const matchId = searchId ? user.id === Number(searchId) : true;
    const matchName = searchName ? user.nombre.toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchUsername = searchUsername ? user.nombreUsuario.toLowerCase().includes(searchUsername.toLowerCase()) : true;
    const matchEmail = searchEmail ? user.email.toLowerCase().includes(searchEmail.toLowerCase()) : true;
    return matchId && matchName && matchUsername && matchEmail;
  });

  if (filteredUsers.length > 0) {
    setSelectedUser(filteredUsers[0]);
  } else {
    alert('Usuario no encontrado');
    setSelectedUser(null);
  }
};
```
### 3. **isFieldDisabled**
- Determina si un campo de búsqueda debe estar deshabilitado según otros criterios de búsqueda. Si hay un valor en algún campo, los demás se deshabilitan para evitar conflictos.

```typescript
const isFieldDisabled = (field: string) => { 
  switch (field) {
    case 'id':
      return !!searchName || !!searchUsername || !!searchEmail;
    case 'name':
      return !!searchId || !!searchUsername || !!searchEmail;
    case 'username':
      return !!searchId || !!searchName || !!searchEmail;
    case 'email':
      return !!searchId || !!searchName || !!searchUsername;
    default:
      return false;
  }
};

```
### 4. **useEffect (admin-check)**
   - Verifica si el usuario actual tiene rol de administrador y actualiza el estado `isAdmin`. Si el usuario tiene el rol adecuado, se habilitan las funcionalidades de administración.

```typescript
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user && user.roles && user.roles.includes("admin-1")) {
    setIsAdmin(true);
  }

  fetchUsers();
}, []);
```
### 5. **useEffect (load-selected-user)**
   - Este `useEffect` carga el usuario previamente seleccionado desde el `localStorage`. Si el usuario existe y está presente en la lista de usuarios (`users`), se establece como el usuario seleccionado en el estado `selectedUser`. Si no, se elimina la entrada del `localStorage`.

```typescript
useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem("selectedUser") || "null");
  if (savedUser) {
    const existsInUsers = users.find((u) => u.id === savedUser.id);
    if (existsInUsers) {
      setSelectedUser(savedUser);
    } else {
      localStorage.removeItem("selectedUser");
    }
  }
}, [users]); 
```
### 6. **handleSetSelectedUser**
   - Función que se encarga de seleccionar o deseleccionar un usuario. Si el usuario seleccionado es el mismo que el ya seleccionado, no realiza ninguna acción. Si se selecciona un nuevo usuario, se guarda en el `localStorage` para persistencia de la selección en futuras sesiones.

```typescript
const handleSetSelectedUser = (user: User | null) => {
  if (user?.id === selectedUser?.id) return;
  setSelectedUser(user); 
  if (user) {
    localStorage.setItem("selectedUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("selectedUser");
  }
};
```
### 7. **fetchUsers**
   - Función asincrónica que recupera la lista de usuarios desde el backend utilizando una solicitud `GET` a la URL `http://localhost:8080/usuarios`. Los datos de usuarios obtenidos se almacenan en el estado `users`. En caso de error, se maneja la excepción y se muestra un mensaje en el estado `error`.

```typescript
const fetchUsers = async () => {
  try {
    const response = await fetch("http://localhost:8080/usuarios");
    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }
    const responseData = await response.json();
    console.log("Estructura de responseData:", responseData);
    if (!Array.isArray(responseData.data)) {
      console.error("El campo 'data' no es un array:", responseData.data);
    }

    const data: User[] = Array.isArray(responseData.data) ? responseData.data : [];
    setUsers(data);
    console.log("Usuarios actualizados en el estado:", data);
  } catch (error) {
    console.error("Error:", error);
    setError("Error al obtener los usuarios");
  } finally {
    setLoading(false);
  }
};
```
### 8. **deleteUser**
   - Función que elimina un usuario enviando una solicitud `DELETE` al backend en la URL `http://localhost:8080/usuarios/{userId}`. Después de eliminar el usuario, la función `fetchUsers` se llama para actualizar la lista de usuarios.

```typescript
const deleteUser = async (userId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el usuario");
    }
    console.log("Usuario eliminado");
    fetchUsers();
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    setError("Error al eliminar el usuario");
  }
};
```
### 9. **handleCancelEdit**
   - Función que cancela la edición del usuario y restablece el estado `editingUser` a `null`.

```typescript
const handleCancelEdit = () => {
  setEditingUser(null);
};
```
### 10. **handleModifyClick**
   - Esta función maneja el clic en el botón para modificar un usuario seleccionado. Si un usuario está seleccionado, se prepara la fecha de nacimiento formateada para la edición y se establece el estado `editingUser` con los datos del usuario.

```typescript
const handleModifyClick = () => {
  if (selectedUser) {
    const fechaOriginal = selectedUser.fechaNacimiento || "";
    const formattedFechaNacimiento = fechaOriginal.includes("T")
      ? fechaOriginal.split("T")[0]
      : fechaOriginal;

    console.log("Fecha formateada:", formattedFechaNacimiento);

    setEditingUser({
      ...selectedUser,
      idRol: selectedUser.idRol,
    });
    setModalAction("modify");
  }
};
```
### 11. **handleUpdateUser**
   - Esta función maneja la actualización de un usuario. Si el campo `idRol` no está definido, se muestra un error. Si todo está correcto, se envía una solicitud `PUT` al backend para actualizar los datos del usuario seleccionado. Si la actualización es exitosa, se vuelve a obtener la lista de usuarios.

```typescript
const handleUpdateUser = async () => {
  console.log("handleUpdateUser llamada");
  if (!editingUser) return;

  if (editingUser.idRol === null || editingUser.idRol === undefined) {
    console.error("idRol no está definido para el usuario que se va a actualizar.");
    setError("El rol del usuario es obligatorio.");
    return;
  }

  const requestBody = {
    idRol: editingUser.idRol,
  };

  console.log("requestBody preparado:", requestBody);

  try {
    const response = await fetch(`http://localhost:8080/usuarios/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log("response:", result);

    if (!response.ok) {
      throw new Error(`Error al actualizar el usuario: ${response.status} - ${result.message || "Error desconocido"}`);
    }

    console.log("Usuario actualizado correctamente");
    fetchUsers();
    setEditingUser(null);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    setError("Error al actualizar el usuario. Verifica los datos.");
  }
};
```
# Manejo de Productos desde administrador

Este documento describe el funcionamiento del componente `ProductManagement` en React. El componente gestiona la visualización, búsqueda, paginación, selección, eliminación y filtrado de productos desde una API.

## 1. **Estado de los Productos y Filtros**
   - El estado de los productos, filtros de búsqueda, y otros estados relacionados con la carga de productos y la selección de productos se gestionan con el hook `useState`.

```typescript
const [products, setProducts] = useState<ProductAdmin[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [selectedProduct, setSelectedProduct] = useState<ProductAdmin | null>(null);
const [, setError] = useState<string | null>(null);
const [searchId, setSearchId] = useState<number | string>('');
const [searchName, setSearchName] = useState<string>('');
const [searchSKU, setSearchSKU] = useState<string>('');
const [searchCategory, setSearchCategory] = useState<number | string>('');
const [currentPage, setCurrentPage] = useState(1);
```
## 2. **fetchProducts**
   - La función fetchProducts obtiene los productos desde la API utilizando fetch. Si la respuesta es exitosa, los productos se almacenan en el estado products.

```typescript
const fetchProducts = useCallback(async () => {
    try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/productos', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Error al cargar los productos');

        const data = await response.json();
        if (Array.isArray(data)) {
            setProducts(data);
        } else {
            throw new Error('Datos de productos no válidos');
        }
    } catch (error) {
        setError(error instanceof Error ? error.message : 'Ha ocurrido un error desconocido');
        console.error(error);
    } finally {
        setLoading(false);
    }
}, []);
