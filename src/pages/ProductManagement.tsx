import { Row, Col, Tab, Tabs, Container, Button, Spinner, Form } from 'react-bootstrap';
import AdminSideBar from '../components/AdminSideBar';
import UserGreeting from '../components/UserGreeting';
import CreateProduct from './CreateProductForm';
import { useCallback, useEffect, useState } from 'react';
import ProductTable from '../components/ProductTable';
import '../styles/ProductManagementStyle.css';
import { ProductAdmin } from '../interfaces/ProductAdmin';

const ProductManagement = () => {
    const [products, setProducts] = useState<ProductAdmin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<ProductAdmin | null>(null);
    const [, setError] = useState<string | null>(null);
    const [searchId, setSearchId] = useState<number | string>('');

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
            console.log("Datos recibidos:", data);

            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                throw new Error('Datos de productos no válidos');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Ha ocurrido un error desconocido');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchId(value);
    };

    const handleSearchSubmit = () => {
        const product = products.find((prod) => prod.id === Number(searchId));
        if (product) {
            setSelectedProduct(product); // Si se encuentra el producto, seleccionarlo
        } else {
            alert('Producto no encontrado');
            setSelectedProduct(null); // Si no se encuentra el producto, deseleccionarlo
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
                            <Tab eventKey="eliminarProducto" title="Gestión de Productos">
                                {loading ? (
                                    <Spinner animation="border" variant="primary" />
                                ) : (
                                    <>
                                    <Row>
                                        {/* Buscador por ID */}
                                        <Col md={2}>
                                            <Form.Label>Buscar por ID</Form.Label>
                                            <Form className="d-flex">

                                                <Form.Control
                                                    type="number"
                                                    placeholder="ID"
                                                    value={searchId}
                                                    onChange={handleSearchChange}
                                                />
                                                <Button onClick={handleSearchSubmit} variant='outline-primary' className='botonbuscador'>
                                                    <span className="material-symbols-outlined">
                                                        search
                                                    </span>
                                                </Button>
                                            </Form>
                                        </Col>

                                        <ProductTable
                                            currentProducts={products}
                                            selectedProduct={selectedProduct}
                                            setSelectedProduct={setSelectedProduct}
                                        />
                                        </Row>
                                    </>
                                )}
                            </Tab>
                        </Tabs>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductManagement;