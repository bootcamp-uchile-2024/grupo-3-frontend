-- Insertar usuarios
INSERT INTO usuarios (contrasena, rut, id_tipo_usuario, nombre_usuario, nombre, apellido, email, telefono, genero, fecha_nacimiento)
VALUES 
('password4', '10666666-6', 3, 'johndoe1', 'John', 'Doe', 'johndoe1@gmail.com', '991122334', 'Masculino', '1990-05-15'),
('password5', '10777777-7', 3, 'janedoe2', 'Jane', 'Doe', 'janedoe2@gmail.com', '992233445', 'Femenino', '1992-08-20'),
('password6', '10888888-8', 3, 'david01', 'David', 'Smith', 'davidsmith01@gmail.com', '993344556', 'Masculino', '1995-02-10'),
('password7', '10999999-9', 3, 'maryjane3', 'Mary', 'Jane', 'maryjane3@gmail.com', '994455667', 'Femenino', '1988-07-25'),
('password8', '11000000-0', 3, 'lucybliss4', 'Lucy', 'Bliss', 'lucybliss4@gmail.com', '995566778', 'Femenino', '1991-09-15'),
('password9', '11111111-1', 3, 'michael20', 'Michael', 'Jordan', 'michaeljordan20@gmail.com', '996677889', 'Masculino', '1984-01-10'),
('password10', '11222222-2', 3, 'emilygreen5', 'Emily', 'Green', 'emilygreen5@gmail.com', '997788990', 'Femenino', '1993-03-12'),
('password11', '11333333-3', 3, 'paulblue6', 'Paul', 'Blue', 'paulblue6@gmail.com', '998899001', 'Masculino', '1994-06-05'),
('password12', '11444444-4', 3, 'lindacool7', 'Linda', 'Cool', 'lindacool7@gmail.com', '999900112', 'Femenino', '1989-12-18'),
('password13', '11555555-5', 3, 'alexbrown8', 'Alex', 'Brown', 'alexbrown8@gmail.com', '991223344', 'Masculino', '1990-11-30');



-- Insertar carros con fecha de apertura
INSERT INTO carros (id_usuario, fecha_creacion)
VALUES 
(1, '2024-11-01'),
(2, '2024-11-02'),
(3, '2024-11-03'),
(4, '2024-11-04'),
(5, '2024-11-05'),
(6, '2024-11-06'),
(7, '2024-11-07'),
(8, '2024-11-08'),
(9, '2024-11-09'),
(10, '2024-11-10');

-- Insertar productos en carros
INSERT INTO carros_productos (id_carro, id_producto, cantidad_producto)
VALUES 
(1, 3, 2),  -- Carro 1, Producto 1 (Ciprés) 
(1, 2, 1),  -- Carro 1, Producto 2 (Espino)
(2, 3, 3),  -- Carro 2, Producto 3 (Grevillea)
(2, 4, 1),  -- Carro 2, Producto 4 (Juniperus-Azul)
(3, 5, 2),  -- Carro 3, Producto 5 (Agatea Verde)
(3, 6, 1),  -- Carro 3, Producto 6 (Dólar Blanco)
(4, 7, 4),  -- Carro 4, Producto 7 (Pennisetum Rubra)
(4, 8, 2),  -- Carro 4, Producto 8 (Sedum Japonicum)
(5, 9, 3),  -- Carro 5, Producto 9 (Buganvilla)
(5, 10, 1); -- Carro 5, Producto 10 (Jazmín del Cabo)



-- Insertar 10 nuevos pedidos
INSERT INTO pedidos (id_usuario, fecha_creacion, id_medio_pago, id_estado, id_tipo_despacho, id_carro, fecha_entrega)
VALUES 
(1, '2024-11-01', 1, 2, 1, 1, '2024-11-15'),
(2, '2024-11-02', 2, 1, 2, 2, '2024-11-16'),
(3, '2024-11-03', 3, 3, 1, 3, '2024-11-17'),
(4, '2024-11-04', 1, 1, 2, 4, '2024-11-18'),
(5, '2024-11-05', 2, 2, 1, 5, '2024-11-19'),
(6, '2024-11-06', 3, 3, 2, 6, '2024-11-20'),
(7, '2024-11-07', 1, 2, 1, 7, '2024-11-21'),
(8, '2024-11-08', 2, 1, 2, 8, '2024-11-22'),
(9, '2024-11-09', 3, 3, 1, 9, '2024-11-23'),
(10, '2024-11-10', 1, 1, 2, 10, '2024-11-24');