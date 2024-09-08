import React, { useEffect, useState } from 'react'
import { IProduct } from '../interfaces/IProduct';

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar la carga de datos
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Función para obtener los productos de la API
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Error al cargar los productos'); // Manejo de errores
      const data: IProduct[] = await response.json();
      setProducts(data);
    } catch (error: any) {
      setError(error.message); // Actualiza el estado de error si hay un problema
    } finally {
      setLoading(false); // Una vez que los datos se cargan, se detiene la carga
    }
  };

  // useEffect para cargar los productos cuando se monta el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Renderizar el contenido
  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="catalog-container">
      <h1>Catálogo de Productos</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p className="product-price">Precio: ${product.price}</p>
            <p className="product-rating">Rating: {product.rating.rate} ({product.rating.count} opiniones)</p>
            <button>Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
}  

export default CatalogPage;
