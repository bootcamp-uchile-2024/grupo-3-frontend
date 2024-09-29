import React, { useEffect, useState } from 'react';
import { ProductosdeCatalogo } from '../interfaces/ProductosdeCatalogo';
import { Link } from 'react-router-dom';

// Función para truncar el texto a un número fijo de palabras
const truncateText = (text: string, maxWords: number) => {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...'; // Une las primeras maxWords palabras
  }
  return text;
};

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<ProductosdeCatalogo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://clon-cotiledonbackend.onrender.com/catalogo');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data: ProductosdeCatalogo[] = await response.json();
      setProducts(data);
    } catch (error: unknown) { 
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="catalog-container">
      {/* <h1>Catálogo de Productos</h1> */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={`https://placehold.co/300x200?text=${encodeURIComponent(product.nombre)}&font=roboto`}
              alt={product.nombre}
              className="product-image"
            />
            <h3>{product.nombre}</h3>
            <p>{truncateText(product.descripcion, 20)}</p> {/* Limitar a 20 palabras */}
            <p className="product-price">Precio: ${product.precio}</p>
            <Link to={`/catalogo/producto/${product.id}`}><button type='button'>Ver detalle</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;

/* 
/Users/chirmus/Git/UChile/PlantAI/grupo-3-frontend/src/pages/CatalogPage.tsx
  25:21  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

El error se debe a que estamos utilizando el tipo any en rl bloque de captura en el try-catch. Para solucionar esto, es recomendable especificar un tipo más adecuado en lugar de any. 

 const fetchProducts = async () => {
    try {
      const response = await fetch('https://clon-cotiledonbackend.onrender.com/catalogo');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data: ProductosdeCatalogo[] = await response.json();
      setProducts(data);
    } catch (error: any) { -> Aqui esta el error
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  Solucion:

   const fetchProducts = async () => {
    try {
      const response = await fetch('https://clon-cotiledonbackend.onrender.com/catalogo');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data: ProductosdeCatalogo[] = await response.json();
      setProducts(data);
    } catch (error: unknown) { 
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };
*/