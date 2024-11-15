/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import Products from '../components/CardProducts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<productsCatalog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Esto debería venir de tu lógica de usuario
  const userRole = 'admin-1'; // Reemplaza esto con la lógica adecuada para obtener el rol del usuario

  const deleteProduct = async (productId: number) => {
    const confirmation = window.confirm(`¿Estás seguro de querer eliminar el producto ${productId}?`);

    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:8080/productos/${productId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
        alert(`Eliminaste exitosamente el producto: ${productId}`);
        // Aquí puede que quieras redirigir o actualizar la lista de productos
        navigate('/catalogo'); // O cualquier otra acción que necesites
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        setError('Hubo un error al eliminar el producto');
      }
    } else {
      console.log('Eliminación cancelada');
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (!id) return;

        const response = await fetch(`http://localhost:8080/productos/${id}`);
        if (!response.ok) {
          throw new Error('No pudimos obtener el producto');
        }
        const productJson = await response.json();
        setProduct(productJson);
      } catch (error) {
        setError('Hubo un error al obtener el producto');
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>{error}</div>;

  const handleAddToCart = (product: productsCatalog) => {
    dispatch(addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      descripcion: product.descripcion,
      cantidad: quantity,
      unidadesVendidas: product.unidadesVendidas,
      puntuacion: product.puntuacion,
      ancho: product.ancho,
      alto: product.alto,
      largo: product.largo,
      peso: product.peso,
    }));
  };

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      handleAddToCart(product);
      navigate('/cart');
    }
  };

  return (
    <>
      <div className="product-detail-container">
        {product && (
          <div className="product-detail-container2">
            <img
              src={`https://placehold.co/700?text=${encodeURIComponent(product.nombre)}&font=roboto`}
              alt={product.nombre}
            />
            <div className="product-info">
              <h1>{product.nombre}</h1>
              <p>Precio: ${product.precio}</p>
              <p>Descripción del producto: {product.descripcion}</p>
              <p>Cantidad: {product.cantidad}</p>
              <p>Unidades vendidas: {product.unidadesVendidas}</p>
              <p>Puntuación: {product.puntuacion}</p>
              <p>Ancho: {product.ancho}</p>
              <p>Alto: {product.alto}</p>
              <p>Largo: {product.largo}</p>
              <p>Peso: {product.peso}</p>
              <br />
              <div className="quantity-controls ms-5">
                <button className="btn btn-secondary me-2" onClick={decrementQuantity}>-</button>
                <span className="mx-1">{quantity}</span>
                <button className="btn btn-secondary me-2 mx-1" onClick={incrementQuantity}>+</button>
                <button className="btn btn-dark w-auto mx-2" type="button" onClick={handleBuyNow}>Comprar</button>
                <button className="btn btn-success w-auto" type="button" onClick={() => handleAddToCart(product)}>Agregar</button>
              </div>
              <br />
              <div className="quantity-controls ms-5">
                {userRole && userRole.includes('admin-1') && (
                  <>
                    <button className="btn btn-outline-danger w-auto mx-2" type="button" onClick={() => deleteProduct(product.id)}>Eliminar</button>
                    <Link to={`/editar-producto/${product.id}`}>
                      <button className="btn btn-primary w-auto mx-2" type="button">Editar</button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Products />
    </>
  );
}