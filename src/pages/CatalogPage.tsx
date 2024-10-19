import React, { useEffect, useState } from 'react';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice'; 


const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<productsCatalog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch(); // Inicializar el dispatch

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://clon-cotiledonbackend.onrender.com/catalogo');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data: productsCatalog[] = await response.json();
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

  const handleAddToCart = (product: productsCatalog) => {
    dispatch(addToCart({ id: product.id, nombre: product.nombre, precio: product.precio, cantidad: 1 })); // Agregar el producto al carrito
  };

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
            <p className="product-price">Precio: ${product.precio}</p>
            <button type='button' onClick={() => handleAddToCart(product)}>Añadir al carrito</button>
            <Link to={`/catalogo/producto/${product.id}`}><button type='button'>Ver detalle</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;