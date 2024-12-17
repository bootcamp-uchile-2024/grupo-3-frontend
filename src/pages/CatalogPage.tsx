import '../styles/CatalogStyles.css'
import '../styles/Offcanvas.css';
import React, { useCallback, useEffect, useState } from 'react';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice';
import { Pagination, Card, Button, Row, Col, Container, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SidebarFilters from '../components/SidebarFilters';
import SortFilters from '../components/SortFiltersCatalog';
import { useSelector } from 'react-redux';
import { RootState } from '../states/store';
import { CatalogFilters } from '../interfaces/CatalogFilters';

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<productsCatalog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState(12);
  const dispatch = useDispatch();
  const [errorMessages, setErrorMessages] = useState<{ [key: number]: string }>({});
  const cart = useSelector((state: RootState) => state.cart.productos);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<productsCatalog | null>(null);
  const [filters, setFilters] = useState<CatalogFilters>({
    petFriendly: undefined,
    puntuacion: 0,
    maxPrecio: 10000,
    minPrecio: 1000,
    planta: {
    idToleranciaTemperatura: 0,
    idIluminacion: 0,
    idTipoRiego: 0,
    },
    ordenarPor: undefined,
    orden: undefined,
  });
  
  const truncateText = (text: string, limit: number) => {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  // Obtener productos desde el servidor
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        minPrecio: filters.minPrecio.toString(),
        maxPrecio: filters.maxPrecio.toString(),
        puntuacion: filters.puntuacion.toString()|| '',
        petFriendly: filters.petFriendly ? 'true' : 'false',
        idToleranciaTemperatura: filters.planta.idToleranciaTemperatura.toString(),
        idIluminacion: filters.planta.idIluminacion.toString(),
        idTipoRiego: filters.planta.idTipoRiego.toString(),
      });
  
      const response = await fetch(`http://localhost:8080/catalogo?${queryParams}`, {
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
  }, [currentPage, pageSize, filters]);  

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage, pageSize, fetchProducts]);  

  const handleAddToCart = (product: productsCatalog) => {
    const productId = product.id;
    const existingCartItem = cart.find((item) => item.id === productId);
    const quantity = existingCartItem ? existingCartItem.cantidad : 1;
  
    if (quantity > product.stock) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [product.id]: `Stock de ${product.stock} unidades.`,
      }));
      return;
    }
  
    const imagePath = product.imagenes?.[0]?.ruta ?? '/estaticos/default-image.jpg';
  
    dispatch(
      addToCart({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: imagePath,
        descripcion: product.descripcion,
        cantidad: quantity,
        unidadesVendidas: product.unidadesVendidas,
        puntuacion: product.puntuacion,
        ancho: product.ancho,
        alto: product.alto,
        largo: product.largo,
        peso: product.peso,
        stock: product.stock,
      })
    );
  
    setSelectedProduct(product);
    setShowOffcanvas(true);
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
    const items: JSX.Element[] = [];

    // Flecha de "anterior"
    items.push(
      <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
    );

    // Primer número de página siempre visible
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    if (currentPage > 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    // Páginas cercanas a la página actual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Si no estamos cerca de la última página, mostrar "..."
    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

    // Último número de página siempre visible
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Flecha de "siguiente"
    items.push(
      <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
    );

    return items;
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img src="https://i.gifer.com/4V0b.gif" alt="Loading..." />
      </div>
    );
  }
  const handleFilterChange = (newFilters: CatalogFilters) => {
    setFilters(newFilters);
  };
  
  if (error) return <p>Error: {error}</p>;

  const handleIncrementQuantity = (product: productsCatalog) => {
    const productId = product.id;
    const currentQuantity = quantities[productId] || 1;
  
    if (currentQuantity >= product.stock) {
      alert(`No puedes agregar más de ${product.stock} unidades.`);
      return;
    }
  
    const newQuantity = currentQuantity + 1;
  
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  
    dispatch(
      addToCart({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagenes?.[0]?.ruta || '/estaticos/default-image.jpg',
        descripcion: product.descripcion,
        cantidad: 1,
        stock: product.stock,
        unidadesVendidas: product.unidadesVendidas,
        puntuacion: product.puntuacion,
        ancho: product.ancho,
        alto: product.alto,
        largo: product.largo,
        peso: product.peso,
      })
    );
  };
  
  
  const handleDecrementQuantity = (product: productsCatalog) => {
    const productId = product.id;
    const currentQuantity = quantities[productId] || 1;
  
    if (currentQuantity <= 1) {
      alert(`No puedes reducir más la cantidad.`);
      return;
    }
  
    const newQuantity = currentQuantity - 1;
  
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  
    dispatch(
      addToCart({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagenes?.[0]?.ruta || '/estaticos/default-image.jpg',
        descripcion: product.descripcion,
        cantidad: -1,
        stock: product.stock,
        unidadesVendidas: product.unidadesVendidas,
        puntuacion: product.puntuacion,
        ancho: product.ancho,
        alto: product.alto,
        largo: product.largo,
        peso: product.peso,
      })
    );
  };
  
  
  
  


  return (
    <>
      <div className="catalog-banner">
        <Container className="banner-content text-center"></Container>
      </div>
      <Container fluid>
        <SortFilters />
        <Row>

          <Col xs={12} sm={3} className="sidebar-filters">
            <SidebarFilters onFilterChange={handleFilterChange}/>
          </Col>

          <Col xs={12} sm={9}>
            <Row lg={4} className="g-4">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <Col key={product.id}>
                    <Card>
                      <Link to={`/catalogo/producto/${product.id}`}>
                      
                      <Card.Img
                        variant="top"
                        src={product.imagenes && product.imagenes.length > 0 ? product.imagenes[0].ruta : '/estaticos/default-image.jpg'}
                        alt={product.nombre}
                        className="card-products-container"
                      />

                      </Link>
                      <Card.Body className="text-start">
                        <div className='contenedordeTituloyDescripcion'>
                          {/* Título del producto */}
                          <Card.Title className="d-flex justify-content-between align-items-center" id="image-text">
                            <span>{truncateText(product.nombre, 12)}</span>
                          </Card.Title>

                          {/* Descripción del producto */}
                          <Card.Text className="description-text">
                            <span>{truncateText(product.descripcion, 20)}</span>
                          </Card.Text>
                        </div>
                        <br />

                        {/* Precio del producto */}
                        <div className="price-text">
                          {new Intl.NumberFormat('es-CL', {
                            style: 'currency',
                            currency: 'CLP',
                            minimumFractionDigits: 0,
                          }).format(product.precio)}
                        </div>

                        {/* Botón para agregar al carrito */}
                        <div className="cart-button-container">
                          <Button
                            variant="primary"
                            className="position-absolute bottom-0 end-0 mb-2 me-2 d-flex justify-content-center align-items-center"
                            id="custom-cart-button"
                            onClick={() => handleAddToCart(product)}
                          >
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                          </Button>
                          {/* Mensaje de error por stock*/}
                          {errorMessages[product.id] && (
                            <p className="error-message">
                              {errorMessages[product.id]}
                            </p>
                          )}
                        </div>

                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p>No se encontraron productos.</p>
              )}
            </Row>

            <br />
            <br />
            <Row className="mb-4 d-flex">
              <Col className="d-flex justify-content-end">
                <Pagination className="pagination-container">
                  {renderPaginationItems()}
                </Pagination>
              </Col>
              <Col xs="auto" sm={5} md={5} className="d-flex justify-content-end">
                <div className="d-inline show-products-selector">
                  <a id="itemshow-products">Mostrar </a>
                  <Link
                    to="#"
                    onClick={() => handlePageSizeChange(12)}
                    className={`text-decoration-none me-3 ${pageSize === 12 ? 'fw-bold' : ''}`}
                  >
                    12
                  </Link>
                  /
                  <Link
                    to="#"
                    onClick={() => handlePageSizeChange(25)}
                    className={`text-decoration-none me-3 ${pageSize === 25 ? 'fw-bold' : ''}`}
                  >
                    25
                  </Link>
                  /
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
          </Col>
        </Row>
        {/* Offcanvas */}
<Offcanvas 
  show={showOffcanvas} 
  onHide={() => setShowOffcanvas(false)} 
  placement="end"
>
  <Offcanvas.Header closeButton>
    <Offcanvas.Title>Mi Carrito de compras</Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body>
    {selectedProduct && (
      <div className="cart-item-card">
        <img 
          src={selectedProduct.imagenes && selectedProduct.imagenes.length > 0 
            ? selectedProduct.imagenes[0].ruta 
            : '/estaticos/default-image.jpg'} 
          alt={selectedProduct.nombre}
          className="cart-item-image"
        />
        <div className="cart-item-details">
          <h5>{selectedProduct.nombre}</h5>
          <div className="cart-item-price">
            Ahora ${selectedProduct.precio.toLocaleString('es-CL')}
            <span className="cart-item-discount">35%</span>
          </div>
          <div className="cart-item-original-price">
            Normal ${(selectedProduct.precio * 1.35).toLocaleString('es-CL')}
          </div>
          <div className="cart-quantity-controls">
            <button
              className="btn-circle"
              onClick={() => handleDecrementQuantity(selectedProduct!)}
            >
              -
            </button>
            <span>{quantities[selectedProduct?.id || 0] || 1}</span>
            <button
              className="btn-circle"
              onClick={() => handleIncrementQuantity(selectedProduct!)}
            >
              +
            </button>
          </div>

        </div>
        <button className="delete-button">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    )}
    
    <div className="cart-total">
      <div className="d-flex justify-content-between">
        <span>Total a pagar:</span>
        <span>${((selectedProduct?.precio || 0) * (quantities[selectedProduct?.id || 0] || 1)).toLocaleString('es-CL')}</span>
      </div>
    </div>
  </Offcanvas.Body>
  <div className="offcanvas-footer">
    <button 
      className="btn-go-to-cart"
      onClick={() => navigate('/cart')}
    >
      Ir al carrito de compras
    </button>
    <button 
      className="btn-continue-shopping"
      onClick={() => setShowOffcanvas(false)}
    >
      Sigue comprando
    </button>
  </div>
</Offcanvas>
      </Container>
    </>
  );
};

export default CatalogPage;