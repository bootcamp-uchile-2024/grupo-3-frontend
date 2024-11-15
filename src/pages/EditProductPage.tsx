import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Product {
  id?: number;
  SKU?: string;
  nombre: string;
  idCategoria?: number;
  precio: number;
  descripcion: string;
  imagen: string;
  cantidad: number;
  unidadesVendidas?: number;
  puntuacion?: number;
  ancho: number;
  alto: number;
  largo: number;
  peso: number;
}

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({ 
    nombre: '',
    precio: 0,
    descripcion: '',
    imagen: '',
    cantidad: 0,
    ancho: 0,
    alto: 0,
    largo: 0,
    peso: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID de producto no válido');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/productos/${id}`);
        if (!response.ok) throw new Error('Error al obtener los detalles del producto');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      } 
    }; 
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/productos/${id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
        console.log (product)
      }
      alert('Producto actualizado exitosamente');
      navigate(`/catalogo/producto/${id}`);
    } catch (error) {
      setError('Hubo un error al actualizar el producto');
    }
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="Create-product-container">
      <form onSubmit={handleSubmit}>
        <h2>Editar Producto</h2>
        <div className="Create-product-container-divs">
          <label htmlFor="nombre">Nombre del producto:</label>
          <input
            type="text"
            id="nombre"
            className="Create-product-container-inputs"
            value={product.nombre || ''}
            onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            className="Create-product-container-inputs"
            value={product.precio || ''}
            onChange={(e) => setProduct({ ...product, precio: Number(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            className="Create-product-container-inputs"
            value={product.descripcion || ''}
            rows={5}
            cols={40}
            onChange={(e) => setProduct({ ...product, descripcion: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="imagen">Imagen:</label>
          <input
            type="text"
            id="imagen"
            className="Create-product-container-inputs"
            value={product.imagen || ''}
            onChange={(e) => setProduct({ ...product, imagen: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            className="Create-product-container-inputs"
            value={product.cantidad || ''}
            onChange={(e) => setProduct({ ...product, cantidad: Number(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="ancho">Ancho:</label>
          <input
            type="number"
            id="ancho"
            className="Create-product-container-inputs"
            value={product.ancho || ''}
            onChange={(e) => setProduct({ ...product, ancho: Number(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="alto">Alto:</label>
          <input
            type="number"
            id="alto"
            className="Create-product-container-inputs"
            value={product.alto || ''}
            onChange={(e) => setProduct({ ...product, alto: Number(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="largo">Largo:</label>
          <input
            type="number"
            id="largo"
            className="Create-product-container-inputs"
            value={product.largo || ''}
            onChange={(e) => setProduct({ ...product, largo: Number(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="peso">Peso:</label>
          <input
            type="number"
            id="peso"
            className="Create-product-container-inputs"
            value={product.peso || ''}
            onChange={(e) => setProduct({ ...product, peso: Number(e.target.value) })}
          />
        </div>
        <div>
          <button type="submit">Actualizar Producto</button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;