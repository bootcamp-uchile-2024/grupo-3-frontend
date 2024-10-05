import React, { useEffect, useState } from 'react';
import { ProductosdeCatalogo } from '../interfaces/ProductosdeCatalogo';
import { Link } from 'react-router-dom';
import { truncateText } from '../utils/truncateText';

const CatalogPage: React.FC = () => {
  const [state, setState] = useState({
    loading: true,
    products: [] as ProductosdeCatalogo[],
    error: null as string | null,
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://clon-cotiledonbackend.onrender.com/catalogo');
      if (!response.ok) throw new Error('Error al cargar los productos');

      const data: ProductosdeCatalogo[] = await response.json();
      setState({ loading: false, products: data, error: null });
    } catch (error: unknown) {
      setState({
        loading: false,
        products: [],
        error: error instanceof Error ? error.message : 'Ocurrió un error desconocido',
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const { loading, products, error } = state;

  if (loading) return <p>Cargando productos...</p>; // 
  if (error) return <p>Error: {error}</p>; 

  return (
    <div className="catalog-container">
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={`https://placehold.co/300x200?text=${encodeURIComponent(product.nombre)}&font=roboto`}
              alt={product.nombre}
              className="product-image"
            />
            <h3>{product.nombre}</h3>
            <p>{truncateText(product.descripcion, 20)}</p>
            <p className="product-price">Precio: ${product.precio}</p>
            <Link to={`/catalogo/producto/${product.id}`}>
              <button type='button'>Ver detalle</button>
            </Link>
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