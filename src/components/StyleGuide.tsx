import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const StyleGuide = () => {
  return (
    <Container className="my-4">
      <h1 className="mb-4">Guía de Estilos</h1>

      {/* Botones Primarios */}
      <section className="mb-4">
        <h2 className="mb-3">Botones Primarios</h2>
        <Row className="mb-3">
          <Col>
            <Button className="btn-primary small">Primary Small</Button>{" "}
            <Button className="btn-primary medium">Primary Medium</Button>{" "}
            <Button className="btn-primary large" disabled>
              Primary Large Disabled
            </Button>
          </Col>
        </Row>
      </section>

      {/* Botones Secundarios y Terciarios */}
      <section className="mb-4">
        <h2 className="mb-3">Botones Secundarios y Terciarios</h2>
        <Row className="mb-3">
          <Col>
            <Button variant="secondary" className="btn-secondary">
              Secondary
            </Button>{" "}
            <Button variant="outline-primary" className="btn-tertiary">
              Tertiary
            </Button>
          </Col>
        </Row>
      </section>

      {/* Botones de Colores */}
      <section className="mb-4">
        <h2 className="mb-3">Botones de Colores</h2>
        <Row className="mb-3">
          <Col>
            <Button variant="warning" className="btn-orange">
              Orange Button
            </Button>{" "}
            <Button variant="dark" className="btn-gray">
              Gray Button
            </Button>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default StyleGuide;
