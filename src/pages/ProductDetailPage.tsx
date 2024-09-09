import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IProduct } from '../interfaces/IProduct';
import Products from '../components/Products';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado para el loading
  const [error, setError] = useState<string | null>(null); // Estado para errores

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (!id) return;

        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
          throw new Error('No pudimos obtener el producto');
        }

        const productJson = await response.json();
        setProduct(productJson);
      } catch (error) {
        setError('Error al obtener el producto');
      } finally {
        setLoading(false); // Ya no está cargando
      }
    };

    getProduct();
  }, [id]);

  if (loading) return <div>Cargando producto...</div>; // Mostrar loading
  if (error) return <div>{error}</div>; // Mostrar error si ocurre

  return (
    <> <div className="product-detail-container">
      {product && (
        <div className="product-detail-container2">
          <img
            src={`https://placehold.co/700?text=${encodeURIComponent(product.title)}&font=roboto`}
            alt={product.title}
          />
          <div className="product-info">
            <h1>{product?.title}</h1>
            <p>Precio: ${product.price}</p>
            <p>Descripción del producto: {product.description}</p>
            <p>Categoría del producto: {product.category}</p>
            <p>Rating: {product.rating.rate} ({product.rating.count} opiniones)</p>
            <br />
            <button type="button">Comprar</button>
            <br />
            <button type="button">Agregar al Carro</button>
          </div>
        </div>
      )}
    </div>
    <Products/>
    </>
  );
}
