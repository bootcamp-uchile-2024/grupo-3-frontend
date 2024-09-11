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
      const response = await fetch('/api/catalogo');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data: ProductosdeCatalogo[] = await response.json();
      setProducts(data);
    } catch (error: any) {
      setError(error.message);
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
      <h1>Catálogo de Productos</h1>
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
            <Link to={`/catalog/product/${product.id}`}><button type='button'>Ver detalle</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;

