import React, { useEffect, useState } from 'react';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { Link } from 'react-router-dom';
import { truncateText } from '../utils/truncateText';

const CatalogPage: React.FC = () => {
  const [state, setState] = useState({
    loading: true,
    products: [] as productsCatalog[],
    error: null as string | null,
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://clon-cotiledonbackend.onrender.com/catalogo');
      if (!response.ok) throw new Error('Error al cargar los productos');

      const data: productsCatalog[] = await response.json();
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