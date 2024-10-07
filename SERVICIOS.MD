# Servicios del proyecto E-commerce PlantAI

## Servicio Catálogo

- **Descripción**: Muestra la oferta visible para los usuarios. <br>
- **Método HTTP:** GET
- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/catalogo <br>
- **Ruta local**: http://localhost:5173/catalog <br>
- **Interface utilizada:** productosDeCatalogo

## Detalles de Producto<br>

- **Descripción**: Proporciona los detalles específicos de un producto individual en el catálogo.<br>
- **Método HTTP:** GET
- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/productos/{id} <br>
- **Ruta local**: http://localhost:5173/catalog/producto/{id} <br>
- **Interface utilizada:** productosDeCatalogo

## Creación de Producto

- **Descripción**: Facilita la creación de nuevos productos a través de un formulario que recolecta información clave, como nombre, precio, descripción, entre otros. El servicio valida los datos proporcionados y almacena el producto en la base de datos para su inclusión en el catálogo de la plataforma.
- **Método HTTP:** POST
- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/productos<br>
- **Ruta local**: http://localhost:5173/crear-producto <br>
- **Interface utilizada:** crearProductoData

## Servicio Autentificación

- **Descripción**: Permite la autenticación tanto de usuario como de administrador a través de un formulario. Verifica las credenciales proporcionadas, validando el acceso a la plataforma y garantizando que solo usuarios autorizados puedan acceder a sus funcionalidades correspondientes.
  <br>
 - **Método HTTP:** POST
- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/auth/login <br>
- **Ruta local**: http://localhost:5173/login <br>

## Creación de Usuario

- **Descripción**: Permite la creación de un nuevo usuario a través de un formulario que recopila los datos básicos necesarios. Se asegura de validar la información proporcionada y almacena los datos del usuario en la base de datos del sistema para futuras autenticaciones y uso dentro de la plataforma. <br>
- **Método HTTP:** POST
- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/usuarios <br>
- **Ruta local**: http://localhost:5173/crear-usuario<br>
- **Interface utilizada:** createUsuarioDTO

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
