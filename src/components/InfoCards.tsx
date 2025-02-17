import { Container, Row, Col, Card } from "react-bootstrap";
import "../styles/InfoCards.css";

const InfoCards = () => {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center g-4">
        {/* Card Envío */}
        <Col lg={4}>
          <Card className="info-card">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-container">
                <span className="material-symbols-outlined">
                  local_shipping
                </span>
              </div>
              <div className="content-container">
                <Card.Title>ENVÍO GRATIS</Card.Title>
                <Card.Text>Comprando desde nuestra App móvil.</Card.Text>
                <button className="custom-button">Aplicación</button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card Club */}
        <Col lg={4}>
          <Card className="info-card">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-container-circle">
                <span className="material-symbols-outlined">
                  star
                </span>
              </div>
              <div className="content-container">
                <Card.Title>CLUB PLANTAI</Card.Title>
                <Card.Text>Descubre todos nuestros beneficios.</Card.Text>
                <button className="custom-button">Beneficios</button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card Consejos */}
        <Col lg={4}>
          <Card className="info-card">
            <Card.Body className="d-flex align-items-center">
              <div className="icon-container">
                <div className="plant-icon">
                  <span className="material-symbols-outlined">
                    grass
                  </span>
                </div>
              </div>
              <div className="content-container">
                <Card.Title>CONSEJOS Y TIPS</Card.Title>
                <Card.Text>Todo sobre el cuidado para tus plantas.</Card.Text>
                <button className="custom-button">Consejos</button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InfoCards;