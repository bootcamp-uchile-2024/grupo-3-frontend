import React, { useEffect, useState } from 'react';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../states/cartSlice';
import { Button, Row, Col, Container, Offcanvas } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../states/store';
import '../styles/FeaturedProducts.css';

const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<productsCatalog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [errorMessages, setErrorMessages] = useState<{ [key: number]: string }>({});
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<productsCatalog | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state: RootState) => state.cart.productos);

    const truncateText = (text: string, limit: number) => {
        if (text.length > limit) {
            return text.substring(0, limit) + "...";
        }
        return text;
    };

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                const baseUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${baseUrl}/catalogo?page=1&pageSize=6`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar los productos destacados');
                }

                const data = await response.json();
                setProducts(data.data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Ha ocurrido un error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

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
            })
        );

        setSelectedProduct(product);
        setShowOffcanvas(true);
        setErrorMessages((prevMessages) => ({
            ...prevMessages,
            [product.id]: '',
        }));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <img src="https://i.gifer.com/4V0b.gif" alt="Loading..." />
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <Container fluid>
            <Row>
            <h2 className="text-l-medium mt-4 mb-4 me-auto">Productos destacados</h2>
                <Col className='products-container h-100'>
                    <Row xs={1} sm={3} md={3} lg={6} className="g-3">
                        {Array.isArray(products) && products.length > 0 ? (
                            products.map((product) => (
                                <Col>
                                    <Card className="product-card h-100">
                                        <span className="material-symbols-outlined position-absolute top-0 end-0 m-2 z-1" style={{ color: '#1A4756' }}>
                                            pets
                                        </span>

                                        <Link to={`/catalogo/producto/${product.id}`}>
                                            {/* Solo una imagen */}
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
                                            <div className='contenedordeTituloyDescripcion'>
                                                <Card.Title className="d-flex justify-content-between align-items-center" id="image-text">
                                                    <span>{truncateText(product.nombre, 12)}</span>
                                                </Card.Title>
                                                <Card.Text className="description-text">
                                                    <span>{truncateText(product.descripcion, 20)}</span>
                                                </Card.Text>
                                            </div>
                                            <br />
                                            <div className="price-text">
                                                {new Intl.NumberFormat('es-CL', {
                                                    style: 'currency',
                                                    currency: 'CLP',
                                                    minimumFractionDigits: 0,
                                                }).format(product.precio)}
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
                            <p>No se encontraron productos destacados.</p>
                        )}
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
                                        src={
                                            selectedProduct.imagenes && selectedProduct.imagenes.length > 0
                                                ? `${import.meta.env.MODE === 'development' ? '' : import.meta.env.VITE_API_URL}${selectedProduct.imagenes[0].ruta}`
                                                : '/estaticos/default-image.jpg'
                                        }
                                        alt={selectedProduct.nombre}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <h5>{selectedProduct.nombre}</h5>
                                        <div className="cart-item-price">
                                            ${selectedProduct.precio.toLocaleString('es-CL')}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="cart-total">
                                <div className="d-flex justify-content-between">
                                    <span>Total a pagar:</span>
                                    <span>${selectedProduct?.precio.toLocaleString('es-CL')}</span>
                                    <span>${selectedProduct?.precio.toLocaleString('es-CL')}</span>
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
                </Col>
            </Row>
        </Container>
    );
};

export default FeaturedProducts;