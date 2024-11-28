import '../styles/CatalogStyles.css'
import React, { useEffect, useState } from 'react';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice';
import { Pagination, Card, Button, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartPlus } from 'react-bootstrap-icons';

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<productsCatalog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [userRole, setUserRole] = useState<string[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState(12);
  const dispatch = useDispatch();
  const [errorMessages, setErrorMessages] = useState<{ [key: number]: string }>({});

  // Cargar productos
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && Array.isArray(user.roles)) {
      setUserRole(user.roles);
    }
    fetchProducts();
  }, [currentPage, pageSize]);

  // Obtener productos desde el servidor
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/catalogo?page=${currentPage}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al cargar los productos');

      const data = await response.json();

      if (Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalPages(Math.ceil(data.totalItems / pageSize));
      } else {
        throw new Error('Datos de productos no válidos');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ha ocurrido un error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar cantidad de producto
  const handleQuantityChange = (productId: number, increment: boolean) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) + (increment ? 1 : -1)),
    }));
  };

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
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    } else {
      console.log('Eliminación cancelada');
    }
  };

  // Agregar al carrito
  const handleAddToCart = (product: productsCatalog) => {
    const quantity = quantities[product.id] || 1;

    if (quantity > product.cantidad) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [product.id]: `Stock insuficiente. Solo hay ${product.cantidad} unidades disponibles.`,
      }));
      return;
    }
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
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      [product.id]: '',
    }));
  };

  // Cambiar página de la paginación
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Función para renderizar la paginación
  const renderPaginationItems = () => {
    let items: JSX.Element[] = [];

    items.push(
      <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
    );

    const pageNumbers = [];
    if (currentPage > 3) {
      pageNumbers.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    if (currentPage < totalPages - 2) {
      pageNumbers.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }
    items.push(...pageNumbers);

    items.push(
      <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
    );

    return items;
  };

  // Cambiar cantidad de productos por página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <><div className="catalog-banner">
      <Container className="banner-content text-center">
      </Container>
    </div><Container fluid style={{ backgroundColor: 'white' }}>
        <Row xs={2} lg={4} className="g-4">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <Col key={product.id}>
                <Card>
                  <Link to={`/catalogo/producto/${product.id}`} className="btn btn-link">
                    <Card.Img
                      variant="top"
                      src={`https://placehold.co/210x270?text=${encodeURIComponent(product.nombre)}&font=roboto`}
                      alt={product.nombre}
                      className="rounded" />
                  </Link>
                  <Card.Body className="text-start">
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      <span>{product.nombre}</span>
                    </Card.Title>

                    <div className="d-flex flex-column align-items-start">
                      <span> {product.descripcion}</span>
                      <Card.Text className="fw-bold bold-text">${product.precio}
                      </Card.Text>
                      {errorMessages[product.id] && (
                        <p className="error-message" style={{ color: 'red', fontSize: '0.9em' }}>
                          {errorMessages[product.id]}
                        </p>
                      )}
                      <div className="quantity-controls">
                        <Button
                          className="btn-primary small rounded-circle"
                          onClick={() => handleQuantityChange(product.id, false)}
                          style={{ width: '24px', height: '24px', padding: '0' }}
                        >
                          -
                        </Button>

                        <span>{quantities[product.id] || 1}</span>

                        <Button
                          className="btn-primary small rounded-circle"
                          onClick={() => handleQuantityChange(product.id, true)}
                          style={{ width: '24px', height: '24px', padding: '0' }}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {userRole && userRole.includes('admin-1') && (
                      <div className="mt-2">
                        <Button variant="danger" size="sm" onClick={() => deleteProduct(product.id)}>
                          Eliminar
                        </Button>
                        <Link to={`/editar-producto/${product.id}`}>
                          <Button variant="warning" size="sm" className="ms-2">
                            Editar
                          </Button>
                        </Link>
                      </div>
                    )}
                  </Card.Body>
                  <div className="cart-button-container">
                  <Button variant="primary" className="position-absolute bottom-0 end-0 mb-2 me-2" onClick={() => handleAddToCart(product)}>
                    <CartPlus size={20} />
                  </Button>
                </div>

                </Card>
              </Col>
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </Row>

        {/* Selector para la cantidad de productos por página */}
        <Row className="mb-4">
          <Col className="d-flex justify-content-end">
            <div className="d-inline show-products-selector">
              <a id='itemshow-products'>Mostrar </a>
              <Link
                to="#"
                onClick={() => handlePageSizeChange(12)}
                className={`text-decoration-none me-3 ${pageSize === 12 ? 'fw-bold' : ''}`}
              >
                12
              </Link>/
              <Link
                to="#"
                onClick={() => handlePageSizeChange(25)}
                className={`text-decoration-none me-3 ${pageSize === 25 ? 'fw-bold' : ''}`}
              >
                25
              </Link>/
              <Link
                to="#"
                onClick={() => handlePageSizeChange(50)}
                className={`text-decoration-none ${pageSize === 50 ? 'fw-bold' : ''}`}
              >
                50
              </Link>
            </div>
          </Col>
        </Row>

        {/* Paginación */}
        <Pagination className="pagination-container d-flex justify-content-center m">
          {renderPaginationItems()}
        </Pagination>
      </Container></>
  );
};

export default CatalogPage;