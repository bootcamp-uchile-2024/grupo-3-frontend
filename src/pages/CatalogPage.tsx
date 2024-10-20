import React, { useEffect, useState } from 'react';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice'; 


const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<productsCatalog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
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

  const handleQuantityChange = (productId: number, increment: boolean) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) + (increment ? 1 : -1)), // Evita valores menores a 1
    }));
  };

  const handleAddToCart = (product: productsCatalog) => {
    const quantity = quantities[product.id] || 1;
    dispatch(addToCart({ id: product.id, nombre: product.nombre, precio: product.precio, cantidad: quantity })); // Agregar el producto al carrito
  };

  if (loading) return <p>Cargando productos...</p>;
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
            <p className="product-price">Precio: ${product.precio}</p>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(product.id, false)}>-</button>
              <span>{quantities[product.id] || 1}</span>
              <button onClick={() => handleQuantityChange(product.id, true)}>+</button>
            </div>
            <button type='button' onClick={() => handleAddToCart(product)}>Añadir al carrito</button>
            <Link to={`/catalogo/producto/${product.id}`}><button type='button'>Ver detalle</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;