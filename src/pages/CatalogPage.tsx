import React, { useEffect, useState } from 'react';
import { IProduct } from '../interfaces/IProduct';

// Función para truncar el texto a un número fijo de palabras
const truncateText = (text: string, maxWords: number) => {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...'; // Une las primeras maxWords palabras
  }
  return text;
};

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data: IProduct[] = await response.json();
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
              src={`https://placehold.co/300x200?text=${encodeURIComponent(product.title)}&font=roboto`}
              alt={product.title}
              className="product-image"
            />
            <h3>{product.title}</h3>
            <p>{truncateText(product.description, 20)}</p> {/* Limitar a 20 palabras */}
            <p className="product-price">Precio: ${product.price}</p>
            <p className="product-rating">
              Rating: {product.rating.rate} ({product.rating.count} opiniones)
            </p>
            <button>Ver Detalle</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;

