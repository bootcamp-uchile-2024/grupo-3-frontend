import { Container, Row, Col, Button } from "react-bootstrap";

const StyleGuide = () => {
  return (
    <Container className="my-4">
      <h1 className="text-xxl-medium mb-4">Guía de Estilos</h1>

      {/* Botones Primarios */}
      <section className="mb-4">
        <h2 className="text-xl-medium mb-3">Botones Primarios</h2>
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
        <h2 className="text-xl-medium mb-3">Botones Secundarios y Terciarios</h2>
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
        <h2 className="text-xl-medium mb-3">Botones de Colores</h2>
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

      {/* Estilos de Texto */}
      <section className="mb-4">
        <h2 className="text-xl-medium mb-3">Estilos de Texto</h2>
        <Row>
          <Col>
            <p className="text-xxl-medium">Texto XXL Medium</p>
            <p className="text-xl-medium">Texto XL Medium</p>
            <p className="text-l-medium">Texto L Medium</p>
            <p className="text-m-medium">Texto M Medium</p>
            <p className="text-m-bold">Texto M Bold</p>
            <p className="text-text1-regular">Texto Regular Text1</p>
            <p className="text-text2-medium">Texto Medium Text2</p>
            <p className="text-text2-bold">Texto Bold Text2</p>
            <p className="text-text3-regular">Texto Regular Text3</p>
            <p className="text-text3-semibold">Texto Semibold Text3</p>
            <p className="text-text4-xxs-regular">Texto Regular Text4 XXS</p>
            <p className="text-text4-xxs-medium">Texto Medium Text4 XXS</p>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default StyleGuide;
