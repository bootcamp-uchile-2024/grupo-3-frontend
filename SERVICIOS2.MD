# Servicios del proyecto E-commerce PlantAI

## Servicio Catálogo

- **Descripción**: Muestra la oferta visible para los usuarios. <br>
- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/catalogo <br>
- **Ruta local**: http://localhost:5173/catalog <br>
- **Interface utilizada:** ProductosdeCatalogo

### Detalles de Producto<br>
- **Descripción**: Proporciona los detalles específicos de un producto individual en el catálogo.<br>

- **EndPoint consumido**: https://clon-cotiledonbackend.onrender.com/productos/{id} <br>
- **Ruta local**: http://localhost:5173/catalog/product/{id} <br>
- **Interface utilizada:** ProductosdeCatalogo

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
