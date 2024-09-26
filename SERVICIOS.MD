# Servicios del proyecto E-commerce PlantAI

## Servicio Catálogo

- **Descripción**: Muestra la oferta visible para los usuarios. <br>
- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/catalogo <br>
- **Ruta local**: http://localhost:5173/catalog <br>
- **Interface utilizada:** ProductosdeCatalogo

## Detalles de Producto<br>
- **Descripción**: Proporciona los detalles específicos de un producto individual en el catálogo.<br>

- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/productos/{id} <br>
- **Ruta local**: http://localhost:5173/catalog/product/{id} <br>
- **Interface utilizada:** ProductosdeCatalogo

## Creación de Producto
- **Descripción**: Facilita la creación de nuevos productos a través de un formulario que recolecta información clave, como nombre, precio, descripción, entre otros. El servicio valida los datos proporcionados y almacena el producto en la base de datos para su inclusión en el catálogo de la plataforma.

- **EndPoint consumido**: ninguno (por ahora)<br>
- **Ruta local**: http://localhost:5173/crearProducto <br>
- **Interface utilizada:** CrearProductoData

## Servicio Autentificación 
- **Descripción**: Permite la autenticación tanto de usuario como de administrador a través de un formulario. Verifica las credenciales proporcionadas, validando el acceso a la plataforma y garantizando que solo usuarios autorizados puedan acceder a sus funcionalidades correspondientes.
<br>
- **EndPoint consumido**: ninguno (por ahora) <br>
- **Ruta local**: http://localhost:5173/login <br>
- **Interface utilizada:** ninguna (por ahora)

## Creación de Usuario

- **Descripción**: Permite la creación de un nuevo usuario a través de un formulario que recopila los datos básicos necesarios. Se asegura de validar la información proporcionada y almacena los datos del usuario en la base de datos del sistema para futuras autenticaciones y uso dentro de la plataforma. <br>
- **EndPoint consumido**: ninguno (por ahora) <br>
- **Ruta local**: http://localhost:5173/create-user<br>
- **Interface utilizada:** ninguna (por ahora)


## Lista de interfaces
**Interface**: ProductosdeCatalogo

- **Descripción:** Define la estructura de los productos que se muestran en el catálogo, proporcionando los atributos clave que representan cada producto.

- **Ruta fichero DTO**: `src/interfaces/ProductosdeCatalogo.ts` <br>

```typescript
interface ProductosdeCatalogo {
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
**Interface**: CrearProductoData

- **Descripción:** Define la estructura del nuevo producto que se va a crear para luego mostrarse en el catálogo, proporcionando los atributos clave que representan cada producto.

- **Ruta fichero DTO**: `src/interfaces/CrearProductoData.ts` <br>

```typescript
interface CrearProductoData {
    nombre: string;
    precio: number;
    imagen: string;
    descripcion: string;
    cantidad: number;
    familia: string;
    fotoperiodo: string;
    tipoRiego: string;
    petFriendly: boolean;
    color: string;
}
```