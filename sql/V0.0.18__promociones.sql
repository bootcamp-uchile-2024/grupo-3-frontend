-- Si se aplica automáticamente o si hay que validarlo con cupón
CREATE TABLE tipos_promociones(
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo varchar(16)
);

-- Si será un descuento por porcentaje o indicará el valor nuevo del producto
CREATE TABLE tipos_descuentos(
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo varchar(16)
);

-- Si se aplicará a todos los productos o solo a algunos
CREATE TABLE tipos_selecciones_productos(
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo varchar(16)
);

-- Tabla de promociones
CREATE TABLE promociones(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion varchar(256),
    valor INT,   -- Valor del % de descuento o del precio fijo
    codigo varchar(20), -- Clave para activar el cupón. Ejemplo: bootcamp2024
    habilitado BOOLEAN,
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE NOT NULL,
    fecha_eliminacion DATE, -- Para softdelete
    id_tipo_promocion INT,  -- Si se aplica automáticamente o si hay que validarlo con cupón
    id_tipo_descuento INT, -- Si será un descuento por porcentaje o indicará el valor nuevo del producto
    id_tipo_seleccion_productos INT,    -- Si se aplicará a todos los productos o solo a algunos
    FOREIGN KEY (id_tipo_promocion) REFERENCES tipos_promociones(id),
    FOREIGN KEY (id_tipo_descuento) REFERENCES tipos_descuentos(id),
    FOREIGN KEY (id_tipo_seleccion_productos) REFERENCES tipos_selecciones_productos(id)
);

-- Tabla de productos seleccionados por promoción
CREATE TABLE productos_promociones(
    id_producto INT,
    id_promocion INT,
    PRIMARY KEY (id_producto, id_promocion),
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_promocion) REFERENCES promociones(id)
);

-- Creación de datos iniciales
INSERT INTO tipos_promociones (tipo)
VALUES  ('TRADICIONAL'),
        ('CUPON');
INSERT INTO tipos_descuentos (tipo)
VALUES  ('PORCENTAJE'),
        ('FIJO');
INSERT INTO tipos_selecciones_productos (tipo)
VALUES  ('TODOS'),
        ('SELECCIONADOS');


-- Cupón de descuento para asistentes del bootcamp
INSERT INTO promociones (nombre, descripcion, valor, codigo, habilitado, fecha_inicio, fecha_termino, id_tipo_promocion, id_tipo_descuento, id_tipo_seleccion_productos)
VALUES  ('Cupón Bootcamp 2024', 'Descuento del 20% en todos los productos, para todos los alumnos e invitados a las presentaciones del Bootcamp de la U. de Chile del año 2024', 20, 'bootcamp2024', TRUE, '2025-01-01', '2026-01-01', 2, 1, 1);