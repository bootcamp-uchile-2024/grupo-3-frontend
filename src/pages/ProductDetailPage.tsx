import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductosdeCatalogo } from '../interfaces/ProductosdeCatalogo';
import Products from '../components/Products';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductosdeCatalogo | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado para el loading
  const [error, setError] = useState<string | null>(null); // Estado para errores

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (!id) return;

        const response = await fetch(`/api/productos/${id}`);
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
       <Link to="/catalog" className="back-to-catalog-button">Regresar a catálogo</Link>
       <br />
      {product && (
        <div className="product-detail-container2">
          <img
            src={`https://placehold.co/700?text=${encodeURIComponent(product.nombre)}&font=roboto`}
            alt={product.nombre}
          />
          <div className="product-info">
            <h1>{product?.nombre}</h1>
            <p>Precio: ${product.precio}</p>
            <p>Descripción del producto: {product.descripcion}</p>
            <p>Cantidad: {product.cantidad}</p>
            <p>Unidades vendidas: {product.unidadesVendidas}</p>
            <p>Puntuación: {product.puntuacion}</p>
            <p>Familia: {product.familia}</p>
            <p>Foto-periodo: {product.fotoperiodo}</p>
            <p>Tipo de Riego: {product.tipoRiego}</p>
            <p>Pet Friendly: {product.petFriendly? 'Si' : 'No'}</p>
            <p>Color: {product.color}</p>
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
