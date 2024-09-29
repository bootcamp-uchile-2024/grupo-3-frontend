// DTO para la solicitud de productos con filtros opcionales
export interface ObtenerProductosRequestDTO {
    filtroNombre?: string;
    filtroCategoria?: string;
    ordenamiento?: 'precio' | 'nombre' | 'puntuacion';
}

// DTO para la solicitud de productos más vendidos (podría no necesitar filtros)
export type ObtenerProductosMasVendidosRequestDTO = unknown; // permite cualquier valor

// DTO para la solicitud de productos recomendados por historial
export type ObtenerProductosRecomendadosRequestDTO = unknown; // permite cualquier valor


/*  
frontend/src/interfaces/CatalogoRequestDTO.ts
  10:18  error  An empty interface declaration allows any non-nullish value, including literals like 0 and "".
- If that's what you want, disable this lint rule with an inline comment or configure the 'allowInterfaces' rule option.
- If you want a type meaning "any object", you probably want object instead.
- If you want a type meaning "any value", you probably want unknown instead  @typescript-eslint/no-empty-object-type
  15:18  error  An empty interface declaration allows any non-nullish value, including literals like 0 and "".
- If that's what you want, disable this lint rule with an inline comment or configure the 'allowInterfaces' rule option.
- If you want a type meaning "any object", you probably want object instead.
- If you want a type meaning "any value", you probably want unknown instead  @typescript-eslint/no-empty-object-type


El error se debe a que hay interfaces vacías que no están definidas con ninguna propiedad, lo que causa advertencias del linter.
Se agregó unknow para que los tipos permitan cualquier valor  */