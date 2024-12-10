import { Row, Col, Tab, Tabs, Container, Button, Spinner, Form } from 'react-bootstrap';
import AdminSideBar from '../components/AdminSideBar';
import UserGreeting from '../components/UserGreeting';
import CreateProduct from './CreateProductForm';
import { useCallback, useEffect, useState } from 'react';
import CustomPagination from '../components/CustomPagination';
import ProductTable from '../components/ProductTable';
import '../styles/ProductManagementStyle.css';
import { ProductAdmin } from '../interfaces/ProductAdmin';

const ProductManagement = () => {
    const [products, setProducts] = useState<ProductAdmin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<ProductAdmin | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage, setProductsPerPage] = useState<number>(50);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [, setError] = useState<string | null>(null);
   
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/productos`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) throw new Error('Error al cargar los productos');
    
            const data = await response.json();

            if (data && data.data && Array.isArray(data.data) && data.totalItems !== undefined) {
                setProducts(data.data);
                setTotalItems(data.totalItems); 
                setTotalPages(Math.ceil(data.totalItems / productsPerPage)); 
                console.log (data.data)
            } else {
                throw new Error('Datos de productos no válidos');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Ha ocurrido un error desconocido');
        } finally {
            setLoading(false);
        }
    }, [currentPage, productsPerPage]);
    
    useEffect(() => {
        fetchProducts();
    }, [currentPage, productsPerPage, fetchProducts]);    

    const handleDeleteProduct = async (productId: number) => {
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

   
    const handlePageSizeChange = (size: number) => {
        setProductsPerPage(size);
        setCurrentPage(1); 
    };

    
    const paginate = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <Container fluid className="mt-4">
            <Col md={12}>
                <UserGreeting />
            </Col>

            <Row>
                <Col>
                    <AdminSideBar />
                </Col>

                {/* Contenido principal */}
                <Col md={10}>
                    <div className="product-management-container">
                        <Tabs defaultActiveKey="productos" className="custom-tabs mb-3">
                            {/* Cargar Productos */}
                            <Tab eventKey="productos" title="Cargar Productos">
                                <div>
                                    <CreateProduct />
                                </div>
                            </Tab>

                            {/* Eliminar Producto */}
                            <Tab eventKey="eliminarProducto" title="Eliminar Producto">
                                {loading ? (
                                    <Spinner animation="border" variant="primary" />
                                ) : (
                                    <>
                                        <h1>Lista de Productos:</h1>
                                        <Form.Select
                                            aria-label="Seleccionar cantidad de productos por página"
                                            value={productsPerPage}
                                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                            className="d-inline w-auto"
                                        >
                                            <option value={12}>12</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </Form.Select>
                                        <span className="ms-2">productos por página</span>
                                        <ProductTable
                                            currentProducts={products}
                                            selectedProduct={selectedProduct}
                                            setSelectedProduct={setSelectedProduct}
                                        />
                                        {selectedProduct && (
                                            <div className="d-flex justify-content-center mt-3 gap-2">
                                                <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                                                    Cancelar
                                                </Button>
                                                <Button variant="danger" onClick={() => handleDeleteProduct(selectedProduct?.id ?? 0)}>
                                                    Eliminar
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Componente de paginación */}
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    paginate={paginate}
                                />

                                {/* Mostrar el número total de productos */}
                                <div className="d-flex justify-content-center mt-3">
                                    {totalItems > 0 ? (
                                        <span>Mostrando {products.length} de {totalItems} productos</span>
                                    ) : (
                                        <span>No hay productos disponibles</span>
                                    )}
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductManagement;