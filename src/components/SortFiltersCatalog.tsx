import '../styles/SortFiltersCatalog.css'
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const SortFilters: React.FC = () => {

    return (
        <Row className="mb-3">
            <Col className="mb-4 mt-5 justify-content-start fs-xl colorlet titulopagecatalog">Plantas de interior</Col>
            <Col className="mb-4 mt-5 justify-content-end">
                <Form.Label className="mb-2 mt-2 me-2 ms-2 colorlet">Ordenar por:</Form.Label>
                <span className="material-symbols-outlined mb-2 mt-2 me-2 ms-2 rotate-90 colorlet">
                    compare_arrows
                </span>
                <div className="custom-select-container colorlet">
                    <Form.Control
                        as="select"
                        className="custom-select colorlet"
                    >
                        <option value="rating">Destacados</option>
                        <option value="price-asc">Precio: Bajo a Alto</option>
                        <option value="price-desc">Precio: Alto a Bajo</option>
                    </Form.Control>
                    <span className="material-symbols-outlined custom-arrow">
                        keyboard_arrow_down
                    </span>
                </div>
            </Col>
        </Row>
    );
};

export default SortFilters;
