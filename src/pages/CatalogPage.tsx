import '../styles/CatalogStyles.css';
import '../styles/Offcanvas.css';
import React, { useCallback, useEffect, useState } from 'react';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice';
import { Pagination, Card, Button, Row, Col, Container, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SidebarFilters from '../components/SidebarFilters';
import { SortFilters, SortFilter } from '../components/SortFiltersCatalog';
import { useSelector } from 'react-redux';
import { RootState } from '../states/store';
import { CatalogFilters } from '../interfaces/CatalogFilters';
import SearchBar from '../components/SearchBar';

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
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');
  const [filters, setFilters] = useState<CatalogFilters>({
    petFriendly: undefined,
    puntuacion: 0,
    maxPrecio: 10000,
    minPrecio: 1000,
    planta: {
      idToleranciaTemperatura: 0,
      idIluminacion: 0,
      idTipoRiego: 0,
      idTamano: 0,
    },
    ordenarPor: undefined,
    orden: undefined,
    page: 1,
    pageSize: 12,
  });

  const truncateText = (text: string, limit: number) => {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (searchTerm) queryParams.append('search', searchTerm);
      if (filters.minPrecio && filters.minPrecio !== 1000)
        queryParams.append('minPrecio', filters.minPrecio.toString());
      if (filters.maxPrecio && filters.maxPrecio !== 10000)
        queryParams.append('maxPrecio', filters.maxPrecio.toString());
      if (filters.puntuacion !== 0) queryParams.append('puntuacion', filters.puntuacion.toString());
      if (filters.petFriendly !== undefined)
        queryParams.append('petFriendly', filters.petFriendly ? 'true' : 'false');
      if (filters.planta?.idToleranciaTemperatura && filters.planta?.idToleranciaTemperatura !== 0)
        queryParams.append('idToleranciaTemperatura', filters.planta.idToleranciaTemperatura.toString());
      if (filters.planta?.idIluminacion && filters.planta?.idIluminacion !== 0)
        queryParams.append('idIluminacion', filters.planta.idIluminacion.toString());
      if (filters.planta?.idTipoRiego && filters.planta?.idTipoRiego !== 0)
        queryParams.append('idTipoRiego', filters.planta.idTipoRiego.toString());
      if (filters.planta?.idTamano && filters.planta.idTamano !== 0)
        queryParams.append('sizePlant', filters.planta.idTamano.toString());
      if (filters.ordenarPor) queryParams.append('ordenarPor', filters.ordenarPor);
      if (filters.orden) queryParams.append('orden', filters.orden);

      queryParams.append('page', currentPage.toString());
      queryParams.append('pageSize', pageSize.toString());

      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${baseUrl}/catalogo${searchTerm ? '/search' : ''}?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }

      const data = await response.json();
      setProducts(data.data);
      setTotalPages(Math.ceil(data.totalItems / pageSize));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ha ocurrido un error desconocido');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage, pageSize, searchTerm, fetchProducts]);

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
  
    const imagePath = product.imagenes && product.imagenes.length > 0 
      ? product.imagenes[0].ruta 
      : '/estaticos/default-image.jpg';
  
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
        promocionesDestacadas: product.promocionesDestacadas,
      })
    );
  
    setSelectedProduct(product);
    setShowOffcanvas(true);
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      [product.id]: '',
    }));
  };
  

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items: JSX.Element[] = [];

    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    items.push(
      <Pagination.Item key={1} active={currentPage === 1} onClick={() => handlePageChange(1)}>
        1
      </Pagination.Item>
    );

    if (currentPage > 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

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

    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return items;
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: CatalogFilters) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      if (JSON.stringify(updatedFilters) === JSON.stringify(prevFilters)) {
        return prevFilters;
      }
      return updatedFilters;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img src="https://i.gifer.com/4V0b.gif" alt="Loading..." />
      </div>
    );
  }

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

  const handleSortChange = (sortFilter: SortFilter) => {
    setFilters((prevFilters) => {
      if (prevFilters.ordenarPor === sortFilter.ordenarPor && prevFilters.orden === sortFilter.orden) {
        return prevFilters;
      }
      return { ...prevFilters, ordenarPor: sortFilter.ordenarPor, orden: sortFilter.orden };
    });
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
        <Container className="banner-content text-center">
          <SearchBar />
        </Container>
      </div>
      <Container fluid>
        <SortFilters onSortChange={handleSortChange} />
        <Row>
          <Col xs={12} sm={3} className="sidebar-filters">
            <SidebarFilters onFilterChange={handleFilterChange} />
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
                        src={
                          product.imagenes && product.imagenes.length > 0
                            ? `${import.meta.env.VITE_API_URL}${product.imagenes[0].ruta}`
                            : '/estaticos/default-image.jpg'
                        }
                        alt={product.nombre}
                        className="card-products-container"
                      />

                      </Link>
                      <Card.Body className="text-start">
                        <div className="contenedordeTituloyDescripcion">
                          <Card.Title className="d-flex justify-content-between align-items-center" id="image-text">
                            <span>{truncateText(product.nombre, 12)}</span>
                          </Card.Title>
                          <Card.Text className="description-text">
                            <span>{truncateText(product.descripcion, 20)}</span>
                          </Card.Text>
                        </div>
                        <br />
               
                        <div className="price-container">
                          <div className="price-text">
                            {new Intl.NumberFormat('es-CL', {
                              style: 'currency',
                              currency: 'CLP',
                              minimumFractionDigits: 0,
                            }).format(product.precio)}
                          </div>
                          {product.promocionesDestacadas &&
                            product.promocionesDestacadas.length > 0 &&
                            (() => {
                              const promoTradicional = product.promocionesDestacadas.find(
                                (promo) => promo.tipoPromocion === "TRADICIONAL"
                              );
                              return promoTradicional && promoTradicional.valor > 0 ? (
                                <div className="discount-badge">
                                  {promoTradicional.tipoDescuento === 'PORCENTAJE'
                                    ? `${promoTradicional.valor}% off`
                                    : `$${promoTradicional.valor} off`}
                                </div>
                              ) : null;
                            })()}
                        </div>

                        <div className="cart-button-container">
                          <Button
                            variant="primary"
                            className="position-absolute bottom-0 end-0 mb-2 me-2 d-flex justify-content-center align-items-center"
                            id="custom-cart-button"
                            onClick={() => handleAddToCart(product)}
                          >
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                          </Button>
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
              <Col className="d-flex justify-content-end mb-2">
                <Pagination className="pagination-container">{renderPaginationItems()}</Pagination>
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
        {/* Offcanvas del carrito */}
        <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Mi Carrito de compras</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>ƒ
            {selectedProduct && (
              <div className="cart-item-card">
                <img
                  src={
                    selectedProduct.imagenes && selectedProduct.imagenes.length > 0
                      ? `${import.meta.env.VITE_API_URL}${selectedProduct.imagenes[0].ruta}`
                      : '/estaticos/default-image.jpg'
                  }
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
                    <button className="btn-circle" onClick={() => handleDecrementQuantity(selectedProduct!)}>
                      -
                    </button>
                    <span>{quantities[selectedProduct?.id || 0] || 1}</span>
                    <button
                      className="btn-circle"
                      onClick={() => handleIncrementQuantity(selectedProduct!)}
                    >
                      
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
                <span>
                  ${((selectedProduct?.precio || 0) * (quantities[selectedProduct?.id || 0] || 1)).toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </Offcanvas.Body>
          <div className="offcanvas-footer">
            <button className="btn-go-to-cart" onClick={() => navigate('/cart')}>
              Ir al carrito de compras
            </button>
            <button className="btn-continue-shopping" onClick={() => setShowOffcanvas(false)}>
              Sigue comprando
            </button>
          </div>
        </Offcanvas>
      </Container>
    </>
  );
};

export default CatalogPage;
