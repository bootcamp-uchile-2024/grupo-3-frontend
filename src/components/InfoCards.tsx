import { Container, Row, Col, Card, Button } from "react-bootstrap";

const InfoCards = () => {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        {/* Card 1 */}
        <Col md={4} className="mb-4">
        <p className="text-l-medium">Texto L Medium</p>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <div>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#1A4756" }}>
                  local_shipping
                </span>
              </div>
              <Card.Title className="mt-3" style={{ color: "#1A4756", fontWeight: "bold" }}>
                ENVÍO GRATIS
              </Card.Title>
              <Card.Text>En Todos Los Productos Comprando Por</Card.Text>
              <Button style={{ backgroundColor: "#1A4756", border: "none" }}>App Plant Ai</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 2 */}
        <Col md={4} className="mb-4">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <div>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#1A4756" }}>
                  star
                </span>
              </div>
              <Card.Title className="mt-3" style={{ color: "#1A4756", fontWeight: "bold" }}>
                CLUB PLANTAI
              </Card.Title>
              <Card.Text>Descubre Tus</Card.Text>
              <Button style={{ backgroundColor: "#1A4756", border: "none" }}>Beneficios</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 3 */}
        <Col md={4} className="mb-4">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <div>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#1A4756" }}>
                  grass
                </span>
              </div>
              <Card.Title className="mt-3" style={{ color: "#1A4756", fontWeight: "bold" }}>
                CONSEJOS Y TIPS
              </Card.Title>
              <Card.Text>Descubre sobre cuidado de plantas</Card.Text>
              <Button style={{ backgroundColor: "#1A4756", border: "none" }}>Consejos</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InfoCards;
