import React from "react";
import { Button, Row, Col, Container } from "react-bootstrap";

const CardProducts: React.FC = () => {
    return (
        <Container className="my-4">
        <Row className="mb-3">
          <Col>
            <Button className="btn-primary small">Primary Small</Button>
            <Button variant="btn-secondary" className="btn-primary medium">Primary Medium</Button>
            <Button variant="btn-orange" className="btn-primary large" disabled>
              Primary Large Disabled
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button variant="secondary" className="btn-secondary">Secondary</Button>{' '}
            <Button variant="outline-primary" className="btn-tertiary">Tertiary</Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button variant="warning" className="btn-orange">Orange Button</Button>{' '}
            <Button variant="dark" className="btn-gray">Gray Button</Button>
          </Col>
        </Row>
      </Container>
    );
};

export default CardProducts;