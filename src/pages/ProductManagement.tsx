import { Row, Col, Tab, Tabs, Container } from 'react-bootstrap';
import AdminSideBar from '../components/AdminSideBar';
import UserGreeting from '../components/UserGreeting';

const ProductManagement = () => {

    return (
        <Container fluid className="mt-4" style={{}}>
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
                                    <h3>Lista de Productos</h3>
                                    <div>
                                        <ul>
                                        </ul>
                                    </div>
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