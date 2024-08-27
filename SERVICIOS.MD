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
