CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_producto INT NOT NULL,
  puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_producto) REFERENCES productos(id)
);