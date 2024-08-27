# Servicios

## Modulo Busqueda de Productos

## 1. Obtener Todos los Productos

**Descripción**: Obtiene una lista con todos los productos de la página. <br>
**Ruta**: `src/interfaces/BusquedaDeProductosRequestDTO.ts` <br>
**Ruta**: `src/interfaces/BusquedaDeProductosResponseDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosRequestDTO {
  pagina?: number;
}
```

### ResponseDTO

```typescript
export interface ObtenerProductosResponseDTO {
  total: number;
  productos: ProductoSalidaDTO[];
}
```

## 2. Obtener Productos usando Filtros.

**Descripción**: Obtiene una lista de Productos usando filtros de búsqueda. <br>
**Ruta**: `src/interfaces/BusquedaDeProductosRequestDTO.ts` <br>
**Ruta**: `src/interfaces/BusquedaDeProductosResponseDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosFiltroRequestDTO {
  filtroNombre?: string;
  filtroPrecioMin?: number;
  filtroPrecioMax?: number;
  filtroFotoPeriodo?: string;
  filtroFotoRiego?: string;
  filtroPetFriendly?: boolean;
  filtroColor?: string;
}
```

### ResponseDTO

```typescript
interface ObtenerProductosFiltroResponseDTO {
  total: number;
  productos: ProductoSalidaDTO[];
}
```

## 3. Obtener Productos usando ID.

**Descripción**: Obtiene una lista de Productos según su número ID <br>
**Ruta**: `src/interfaces/BusquedaDeProductosRequestDTO.ts` <br>
**Ruta**: `src/interfaces/BusquedaDeProductosResponseDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductoIdRequestDTO {
  id: number;
}
```

### ResponseDTO

```typescript
interface ObtenerProductoIdResponseDTO {
  producto: ProductoSalidaDTO | null;
}
```

## Pedidos

## 1. Crea un pedido

**Descripción**: Creación pedido de un usuario. <br>
**Ruta**: `src/interfaces/CreatePedidosRequestDTO.ts` <br>
**Ruta**: `src/interfaces/CreatePedidosResponse.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface CreatePedidosDTO {
  idUsuaruio: number;
  tipoDespacho: string;
  tipoPago: string;
  carrito: string[];
  fechaEntrega: Date;
}
```

### ResponseDTO

```typescript
import { CreatePedidosDTO } from "./CreatePedidosRequestDTO";

export interface CreatePedidosResponse {
  pedido: CreatePedidosDTO;
  mensaje: string;
}
```

## 2. Filtrar por estado o entrega

**Descripción**: Filtrar pedidos por estado o entrega todos los pedidos. <br>
**Ruta**: `src/interfaces/FiltrarPedidosRequestDTO.ts` <br>
**Ruta**: `src/interfaces/FiltrarPedidosResponse.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface FiltrarPedidosDTO {
  id: number;
  idUsuario: number;
  fechaCreacion: Date;
  estado: string;
  tipoDespacho: string;
  tipoPago: string;
  carrito: string[];
  fechaEntrega: Date;
}
```

### ResponseDTO

```typescript
import { FiltrarPedidosDTO } from "./FiltrarpedidosRequestDTO";

export interface FiltrarPedidosResponse {
  pedidos: FiltrarPedidosDTO[];
  total?: number;
}
```

## 3. Buscar Pedidos

**Descripción**: Buscar pedidos por ID. <br>
**Ruta**: `src/interfaces/BuscarPedidosIdRequestDTO.ts` <br>
**Ruta**: `src/interfaces/BuscarPedidosIdresponse.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface BuscarPedidosPorId {
  id: number;
  idUsuario: number;
  fechaCreacion: Date;
  estado: string;
  tipoDespacho: string;
  tipoPago: string;
  carrito: string[];
  fechaEntrega: Date;
}
```

### ResponseDTO

```typescript
import { BuscarPedidosPorId } from "./BuscarPedidosIdRequestDTO";

export interface BuscarPedidosResponse {
  pedido: BuscarPedidosPorId;
}
```

## 4. Modificar Pedidos

**Descripción**: Modificar Pedidos por ID. <br>
**Ruta**: `src/interfaces/ModificarPedidosRequestDTO.ts` <br>
**Ruta**: `src/interfaces/ModificarPedidosResponse.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface ModificarPedidosIdDTO {
  estado: string;
  tipoDespacho: string;
  tipoPago: string;
  fechaEntrega: Date;
}
```

### ResponseDTO

```typescript
import { ModificarPedidosIdDTO } from "./ModificarPedidosRequestDTO";

export interface ModificarPedidosResponse {
  pedidoActualizado: ModificarPedidosIdDTO;
  mensaje?: string; // Opcional: Mensaje de confirmación o información adicional
}
```

## Catálogo de productos

## 1. Obtener todos los productos del catálogo.

**Descripción**: Obtiene una lista con todos los productos del catálogo. <br>
**Ruta**: `src/interfaces/CatalogoRequestDTO.ts` <br>
**Ruta**: `src/interfaces/CatalogoResponseDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosRequestDTO {
  filtroNombre?: string;
  filtroCategoria?: string;
  ordenamiento?: "precio" | "nombre" | "puntuacion";
}
```

### ResponseDTO

```typescript
interface ProductosDTO {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}
```

## 2. Obtener los productos más vendidos.

**Descripción**: Obtiene una lista con los productos más vendidos del catálogo. <br>
**Ruta**: `src/interfaces/CatalogoRequestDTO.ts` <br>
**Ruta**: `src/interfaces/CatalogoResponseDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosMasVendidosRequestDTO {}
```

### ResponseDTO

```typescript
interface ProductosDTO {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}
```

## 3. Obtener los productos recomendados.

**Descripción**: Obtiene una lista con los productos recomendados por el historial de usuario. <br>
**Ruta**: `src/interfaces/CatalogoRequestDTO.ts` <br>
**Ruta**: `src/interfaces/CatalogoResponseDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosRecomendadosRequestDTO {}
```

### ResponseDTO

```typescript
interface ProductosDTO {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}
```

## 4. Obtener los productos por tips.

**Descripción**: Obtiene una lista con los productos de los tips. <br>
**Ruta**: `src/interfaces/CatalogoRequestDTO.ts` <br>
**Ruta**: `src/interfaces/CatalogoResponseDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosPorTipsRequestDTO {}
```

### ResponseDTO

```typescript
interface ProductosDTO {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}
```
## Modulo Usuarios

## 1. Crear Usuario

**Descripción**: Recibe datos para crear un nuevo usuario. <br>
**Ruta**: `src/interfaces/CreateUsuarioDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface CreateUsuarioDTO {
    name: string;
    password: string;
    email: string;
}
```
## 2. Obtener todos los usuarios

**Descripción**: Devuelve todos los usuarios . <br>
**Ruta**: `src/interfaces/GetUsersDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface GetUsersDTO {
    usuarios: CreateUsuarioDTO[];
}
```

## 3. Obtener usuario por ID

**Descripción**: Devuelve un usuario por su ID . <br>
**Ruta**: `src/interfaces/GetUserID_DTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface GetUserID_DTO {
    id: number;
    name: string;
    email: string;
    carrito: string[];
    productos: string[];
    precioTotal: number;
}
```

## 4. Modificar usuario

**Descripción**: Modifica la información de un usuario . <br>
**Ruta**: `src/interfaces/UpdateUsuarioDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface UpdateUsuarioDTO {
    name: string;
    password: string;
    email: string;   
}
```

## 5. Eliminar usuario 

**Descripción**: Elimina un usuario por ID . <br>
**Ruta**: `src/interfaces/DeleteUserDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface DeleteUserDTO {
    id: number;
}
```

## Modulo Carro de compra

## 1. Crear Carro de compra

**Descripción**: Recibe datos para crear un carro de compra. <br>
**Ruta**: `src/interfaces/CreateCarroCompraDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface CreateCarroCompraDTO {
    id: number;
    cantidad: number;
    producto: Producto;
}
```
## 2. Obtener todos los Carros de compra

**Descripción**: Entrega todos los carros de compra. <br>
**Ruta**: `src/interfaces/GetAllCarroDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface GetAllCarroDTO {
    carros: CreateCarroCompraDTO[];
}
```
## 3. Obtener Carro de compra por ID

**Descripción**: Entrega un carros de compra por ID. <br>
**Ruta**: `src/interfaces/GetCarroID_DTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface GetCarroID_DTO {
    carrito: CarroDTO;
}
```

## 4. Eliminar Carro de compra 

**Descripción**: Elimina un carro de compra. <br>
**Ruta**: `src/interfaces/DeleteCarroDTO.ts` <br>
**Url**: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
export interface DeleteCarroDTO {
    id: number; 
}
```











