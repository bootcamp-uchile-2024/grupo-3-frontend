import { Row, Col, Tab, Tabs, Container, Button, Spinner, Form, Alert } from 'react-bootstrap';
import AdminSideBar from '../components/AdminSideBar';
import UserGreeting from '../components/UserGreeting';
import CreateProduct from './CreateProductForm';
import { useCallback, useEffect, useState } from 'react';
import ProductTable from '../components/ProductTable';
import '../styles/ProductManagementStyle.css';
import { ProductAdmin } from '../interfaces/ProductAdmin';
import CustomPagination from '../components/CustomPagination';
import { Link } from 'react-router-dom';
import DeleteProductModal from '../components/DeleteProductModal';

const ProductManagement = () => {
    const [products, setProducts] = useState<ProductAdmin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<ProductAdmin | null>(null);
    const [, setError] = useState<string | null>(null);

    // Filtros de búsqueda
    const [searchId, setSearchId] = useState<number | string>('');
    const [searchName, setSearchName] = useState<string>('');
    const [searchSKU, setSearchSKU] = useState<string>('');
    const [searchCategory, setSearchCategory] = useState<number | string>('');

  // Estado para controlar el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductAdmin | null>(null);

    // Mensaje de error para no encontrar producto
    const [noProductFound, setNoProductFound] = useState<boolean>(false);

    // Paginador
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const pageCount = Math.ceil(products.length / itemsPerPage);
    const currentPageProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Función para obtener productos
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const backendUrl = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem("token");
            const response = await fetch(`${backendUrl}/productos`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Error al cargar los productos');

            const data = await response.json();
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

    useEffect(() => {
        const selectedProductId = localStorage.getItem('selectedProductId');
        if (selectedProductId) {
            const product = products.find((prod) => prod.id.toString() === selectedProductId);
            if (product) {
                setSelectedProduct(product);
                const productIndex = products.findIndex((prod) => prod.id === product.id);
                if (productIndex !== -1) {
                    const page = Math.floor(productIndex / itemsPerPage) + 1;
                    setCurrentPage(page);
                }
            }
        }
    }, [products]);

    // Manejar el cambio de valor en el buscador
    const handleSearchChange = (event: React.ChangeEvent<HTMLElement>, field: string) => {
        const value = (event.target as HTMLInputElement).value;
        switch (field) {
            case 'id':
                setSearchId(value);
                break;
            case 'name':
                setSearchName(value);
                break;
            case 'sku':
                setSearchSKU(value);
                break;
            case 'category':
                setSearchCategory(value);
                break;
            default:
                break;
        }
    };

    // Manejar la búsqueda de un producto por múltiples filtros
    const handleSearchSubmit = () => {
        const filteredProducts = products.filter((prod) => {
            const matchId = searchId ? prod.id === Number(searchId) : true;
            const matchName = searchName ? prod.nombre.toLowerCase().includes(searchName.toLowerCase()) : true;
            const matchSKU = searchSKU ? prod.SKU.toLowerCase().includes(searchSKU.toLowerCase()) : true;
            const matchCategory = searchCategory ? prod.categoria.id === Number(searchCategory) : true;
            return matchId && matchName && matchSKU && matchCategory;
        });

        if (filteredProducts.length > 0) {
            setSelectedProduct(filteredProducts[0]);
            setNoProductFound(false); 
        } else {
            setSelectedProduct(null);
            setNoProductFound(true); 
        }
    };

    // Cambiar la página cuando seleccionamos un producto
    const handleProductSelect = (product: ProductAdmin | null) => {
        console.log('Selected Product:', product);
        if (product) {
            localStorage.setItem('selectedProductId', product.id.toString());
        } else {
            localStorage.removeItem('selectedProductId');
        }
        setSelectedProduct(product);
        if (product) {
            const productIndex = products.findIndex((prod) => prod.id === product.id);
            if (productIndex !== -1) {
                const page = Math.floor(productIndex / itemsPerPage) + 1;
                setCurrentPage(page);
            }
        } else {
            setCurrentPage(1);
        }
    };

     // Función para abrir el modal de eliminación
  const openDeleteModal = (product: ProductAdmin) => {
    setDeletingProduct(product); // Guardar el producto que se quiere eliminar
    setShowDeleteModal(true); // Mostrar el modal
  };

  // Función para cerrar el modal de eliminación
  const closeDeleteModal = () => {
    setShowDeleteModal(false); // Cerrar el modal
    setDeletingProduct(null); // Limpiar el producto seleccionado
  };

    // Eliminar un producto
    const handleDeleteProduct = async (productId: number) => {
            try {
                const backendUrl = import.meta.env.VITE_API_URL;
                const token = localStorage.getItem("token");
                const response = await fetch(`${backendUrl}/productos/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar el producto');
                }
                fetchProducts();
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
    };

    const resetSearchFilters = () => {
        setSearchId('');
        setSearchName('');
        setSearchSKU('');
        setSearchCategory('');
        setSelectedProduct(null);
    };

    const isFieldDisabled = (field: string) => {
        switch (field) {
            case 'id':
                return !!searchName || !!searchSKU || !!searchCategory;
            case 'name':
                return !!searchId || !!searchSKU || !!searchCategory;
            case 'sku':
                return !!searchId || !!searchName || !!searchCategory;
            case 'category':
                return !!searchId || !!searchName || !!searchSKU;
            default:
                return false;
        }
    };

    return (
        <Container fluid className="mt-5">
            <Row>
                <Col md={12}>
                    <UserGreeting />
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <AdminSideBar />
                </Col>

                {/* Contenido principal */}
                <Col md={10}>
                    <div className="product-management-container">
                        <Tabs defaultActiveKey="productos" className="custom-tabs mb-3">
                            {/* Cargar Productos */}
                            <Tab eventKey="productos" title="Crear Productos">
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
                                            {/* Buscador por Nombre */}
                                            <Col md={3}>
                                                <Form.Label>Buscar por Nombre</Form.Label>
                                                <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Nombre"
                                                        value={searchName}
                                                        onChange={(e) => handleSearchChange(e, 'name')}
                                                        disabled={isFieldDisabled('name')}
                                                    />
                                                </Form>
                                            </Col>
                                            {/* Buscador por Categoría */}
                                            <Col md={3}>
                                                <Form.Label>Buscar por Categoría</Form.Label>
                                                <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Categoría"
                                                        value={searchCategory}
                                                        onChange={(e) => handleSearchChange(e, 'category')}
                                                        disabled={isFieldDisabled('category')}
                                                    />
                                                </Form>
                                            </Col>
                                            {/* Buscador por SKU */}
                                            <Col md={3}>
                                                <Form.Label>Buscar por SKU</Form.Label>
                                                <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="SKU"
                                                        value={searchSKU}
                                                        onChange={(e) => handleSearchChange(e, 'sku')}
                                                        disabled={isFieldDisabled('sku')}
                                                    />
                                                </Form>
                                            </Col>
                                            {/* Buscador por ID */}
                                            <Col md={3}>
                                                <Form.Label>Buscar por ID</Form.Label>
                                                <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="ID"
                                                        value={searchId}
                                                        onChange={(e) => handleSearchChange(e, 'id')}
                                                        disabled={isFieldDisabled('id')}
                                                    />
                                                </Form>
                                            </Col>
                                            <Col className='d-flex justify-content-end'>
                                                <Button onClick={handleSearchSubmit} variant="primary" className="botonbuscador">
                                                    <div> Buscar Producto
                                                    </div>
                                                </Button>
                                            </Col>
                                        </Row>

                                        {/* Mostrar mensaje si no se encuentra el producto */}
                                        {noProductFound && (
                                            <Alert variant="danger">
                                                No se encontraron productos con los filtros aplicados.
                                            </Alert>
                                        )}

                                        <ProductTable
                                            currentProducts={currentPageProducts}
                                            selectedProduct={selectedProduct}
                                            setSelectedProduct={handleProductSelect}
                                        />


                                        {selectedProduct && (
                                            <div className="d-flex mt-3 gap-2">
                                                 <Link to={`/editar-producto/${selectedProduct.id}`}>
                                                    <Button variant="secondary">
                                                        Editar Producto {selectedProduct.id}
                                                    </Button>
                                                </Link>
                                                <Button variant="outline-primary" onClick={resetSearchFilters}>
                                                    Cancelar
                                                </Button>
                                                <Col className='d-flex justify-content-end'>
                                                <Button variant="btn btn-outline-secondary" onClick={() =>  {console.log(selectedProduct); openDeleteModal(selectedProduct!)}}>
                                                    Eliminar Producto {selectedProduct.id}
                                                </Button>
                                               </Col>
                                            </div>
                                        )}

                                        {/* Paginación personalizada */}
                                        <div className="d-flex justify-content-center w-100 mt-3">
                                            <CustomPagination
                                                currentPage={currentPage}
                                                totalPages={pageCount}
                                                paginate={paginate}
                                            />
                                        </div>
                                    </>
                                )}
                            </Tab>
                        </Tabs>
                    </div>
                </Col>
            </Row>

              {/* Modal de confirmación de eliminación */}
      <DeleteProductModal
        show={showDeleteModal}
        product={deletingProduct}
        onClose={closeDeleteModal}
        onDelete={handleDeleteProduct}
      />
        </Container>
    );
};

export default ProductManagement;