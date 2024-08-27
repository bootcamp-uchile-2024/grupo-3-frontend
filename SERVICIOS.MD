# Servicios


## Modulo Busqueda de Productos


## 1. Obtener Todos los Productos

__Descripción__: Obtiene una lista con todos los productos de la página. <br>
__Ruta__: `src/interfaces/BusquedaDeProductosRequestDTO.ts` <br>
__Ruta__: `src/interfaces/BusquedaDeProductosResponseDTO.ts` <br>
__Url__: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

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

__Descripción__: Obtiene una lista de Productos usando filtros de búsqueda. <br>
__Ruta__: `src/interfaces/BusquedaDeProductosRequestDTO.ts` <br>
__Ruta__: `src/interfaces/BusquedaDeProductosResponseDTO.ts` <br>
__Url__: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

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

__Descripción__: Obtiene una lista de Productos según su número ID <br>
__Ruta__: `src/interfaces/BusquedaDeProductosRequestDTO.ts` <br>
__Ruta__: `src/interfaces/BusquedaDeProductosResponseDTO.ts` <br>
__Url__: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

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





## Catálogo de productos 


## 1. Obtener todos los productos del catálogo.

__Descripción__: Obtiene una lista con todos los productos del catálogo. <br>
__Ruta__: `src/interfaces/CatalogoRequestDTO.ts` <br>
__Ruta__: `src/interfaces/CatalogoResponseDTO.ts` <br>
__Url__: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosRequestDTO {
    filtroNombre?: string;
    filtroCategoria?: string;
    ordenamiento?: 'precio' | 'nombre' | 'puntuacion';
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

__Descripción__: Obtiene una lista con los productos más vendidos del catálogo. <br>
__Ruta__: `src/interfaces/CatalogoRequestDTO.ts` <br>
__Ruta__: `src/interfaces/CatalogoResponseDTO.ts` <br>
__Url__: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosMasVendidosRequestDTO {
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





## 3. Obtener los productos recomendados.

__Descripción__: Obtiene una lista con los productos recomendados por el historial de usuario. <br>
__Ruta__: `src/interfaces/CatalogoRequestDTO.ts` <br>
__Ruta__: `src/interfaces/CatalogoResponseDTO.ts` <br>
__Url__: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosRecomendadosRequestDTO {
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





## 4. Obtener los productos por tips.

__Descripción__: Obtiene una lista con los productos de los tips. <br>
__Ruta__: `src/interfaces/CatalogoRequestDTO.ts` <br>
__Ruta__: `src/interfaces/CatalogoResponseDTO.ts` <br>
__Url__: https://github.com/bootcamp-uchile-2024/grupo-3-frontend/tree/main/src/interfaces<br>

### RequestDTO

```typescript
interface ObtenerProductosPorTipsRequestDTO {
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