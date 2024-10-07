/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import Products from '../components/CardProducts';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState< productsCatalog | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado para el loading
  const [error, setError] = useState<string | null>(null); // Estado para errores

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (!id) return;

        const response = await fetch(`https://clon-cotiledonbackend.onrender.com/productos/${id}`);
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
       <Link to="/catalogo" className="back-to-catalog-button">Regresar a catálogo</Link>
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
            <button className="btn btn-dark w-100" type="button">Comprar</button>
            <br />
            <button className="btn btn-success w-100" type="button">Agregar al Carro</button>
          </div>
        </div>
      )}
    </div>
    <Products/>
    </>
  );
}

/* 
error: PlantAI/grupo-3-frontend/src/pages/ProductDetailPage.tsx
  25:16  error  'error' is defined but never used  @typescript-eslint/no-unused-vars

  El error error is defined but never used significa que la variable error se ha declarado pero no se está utilizando en el código.

  No pude solucionarlo en el codigo, me dsalía apareciendo, por lo que agregué:  eslint-disable @typescript-eslint/no-unused-vars 
  al principio del codigo, la cual desactiva la regla solo para esa línea de codigo, podriamos preguntar al profe como solucionarlo


*/