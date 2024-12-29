-- Update a tabla entorno
UPDATE plantas_entorno
SET entorno = "Mixto"
WHERE id = 3;

alter table productos drop column imagen;

-- Tabla para imágenes múltiples de productos
create table imagenes_productos(
    id_producto int,
    ruta varchar(100) primary key,
    foreign key (id_producto) references productos(id)
);

-- Usuario Super Admin (username: administrador, clave: administrador)
INSERT INTO usuarios (contrasena, rut, id_rol, nombre_usuario, nombre, apellido, email, telefono, genero, fecha_nacimiento)
VALUES  
('$2a$10$HwrUIArpcQkdACOWYwohQuWUqndXoFOiPMSbLr2tXKxaE9df0AGrS', '12422222-2', 1, 'administrador', 'Admin', 'Cotiledón', 'admin@cotiledon.com', '951233221', 'Femenino', '1900-01-01');

-- Productos nuevos, hasta el 69
INSERT INTO productos (sku, id_categoria,  stock, nombre,precio, descripcion, unidades_vendidas, puntuacion, ancho, alto, largo, peso, habilitado)
VALUES
('PLANT-Hel-11', 1, 23, 'Helecho de Boston', 2000, 'Planta decorativa ideal para interiores y exteriores.', 30, 4.8, 60, 120, 40, 1500, 1),
('PLANT-Pal-12', 1, 12, 'Palma Areca', 4000, 'Palma tropical ideal para oficinas y hogares.', 50, 4.9, 70, 200, 60, 5000, 1),
('PLANT-Orq-13', 1, 30, 'Orquídea', 2500, 'Planta de flores hermosas para decoración.', 40, 4.7, 20, 50, 20, 1200, 1),
('PLANT-Bon-14', 1, 2, 'Bonsái', 14500, 'Pequeño árbol ideal para interiores.', 35, 4.8, 25, 30, 25, 1800, 1),
('PLANT-Suc-15', 1, 20, 'Suculenta', 2000, 'Planta de bajo mantenimiento ideal para decoración.', 60, 4.5, 15, 10, 15, 500, 1),
('PLANT-Cac-16', 1, 10, 'Cactus San Pedro', 6200, 'Cactus de fácil cuidado.', 25, 4.6, 20, 30, 20, 800, 1),
('PLANT-Lav-17', 1, 12, 'Lavanda', 6000, 'Planta aromática ideal para exteriores.', 40, 4.7, 50, 80, 50, 2500, 1),
('PLANT-Alo-18', 1, 20, 'Aloe Vera', 3000, 'Planta medicinal fácil de cuidar.', 55, 4.9, 40, 100, 40, 2000, 1),
('PLANT-Cun-19', 1, 11, 'Cuna de Moisés', 15000, 'Planta de interiores con hojas verdes.', 45, 4.7, 30, 60, 30, 1500, 1),
('PLANT-Cac-20', 1, 42, 'Cactus Echinopsis', 8000, 'Pequeño cactus ideal para decoraciones.', 10, 4.3, 10, 20, 10, 500, 1),
('PLANT-San-21', 1, 7, 'Sansevieria', 2500, 'Planta resistente y decorativa para interiores.', 70, 4.8, 40, 80, 40, 1200, 1),
('PLANT-Bam-22', 1, 10, 'Bambú de la Suerte', 18000, 'Planta ornamental de bajo mantenimiento.', 85, 4.9, 15, 50, 15, 600, 1),
('PLANT-Cal-23', 1, 18, 'Calathea', 8000, 'Planta de hojas decorativas para interiores.', 60, 4.7, 35, 70, 35, 1000, 1),
('PLANT-Hie-24', 1, 26, 'Hiedra', 9000, 'Planta trepadora ideal para exteriores.', 50, 4.6, 25, 150, 25, 800, 1),
('PLANT-Cro-25', 1, 10, 'Crotón', 3000, 'Planta de hojas coloridas para interiores.', 45, 4.8, 30, 70, 30, 1300, 1),
('PLANT-Pot-26', 1, 10, 'Potus', 1200, 'Planta colgante resistente para interiores.', 75, 4.9, 20, 60, 20, 800, 1),
('PLANT-Ger-27', 1, 30, 'Geranio', 3000, 'Planta con flores coloridas ideal para exteriores.', 90, 4.7, 30, 50, 30, 1200, 1),
('PLANT-Ros-28', 1, 10, 'Rosa Miniatura', 600, 'Planta ornamental con flores pequeñas.', 55, 4.6, 40, 60, 40, 1500, 1),
('PLANT-Zam-29', 1, 20, 'Zamioculca', 12000, 'Planta resistente de bajo mantenimiento.', 65, 4.8, 30, 80, 30, 1100, 1),
('PLANT-Cla-30', 1, 40, 'Clavel', 3000, 'Planta de flores perfumadas.', 40, 4.7, 25, 40, 25, 900, 1);

-- Plantas para productos nuevos. Además se llena la planta 10, que quedó vacía
INSERT INTO plantas (id_producto, pet_friendly, id_tipo_riego, id_fotoperiodo, ciclo, id_habito_crecimiento, id_color, especie, id_tolerancia_temperatura, id_tamaño, id_entorno, id_iluminacion)
VALUES
(10, 1, 3, 2, 0, 4, 5, 'Gardenia jasminoide', 2, 1, 3, 2),
(50, 1, 2, 3, 1, 3, 1, 'Nephrolepis exaltata', 1, 3, 2, 2),
(51, 1, 3, 2, 0, 2, 7, 'Dypsis lutescens', 1, 4, 2, 1),
(52, 0, 4, 3, 0, 1, 10, 'Orchidaceae spp.', 2, 1, 3, 3),
(53, 1, 5, 2, 1, 4, 11, 'Ficus retusa', 1, 2, 1, 2),
(54, 1, 6, 1, 1, 2, 13, 'Crassula ovata', 3, 1, 1, 3),
(55, 0, 7, 1, 0, 3, 7, 'Echinopsis pachanoi', 2, 2, 2, 1),
(56, 1, 1, 2, 1, 4, 6, 'Lavandula angustifolia', 2, 4, 3, 2),
(57, 1, 2, 3, 0, 1, 1, 'Aloe barbadensis', 1, 3, 2, 1),
(58, 1, 3, 2, 1, 2, 13, 'Spathiphyllum spp.', 2, 2, 2, 3),
(59, 0, 7, 1, 1, 4, 7, 'Echinopsis spp.', 3, 1, 1, 1),
(60, 1, 3, 2, 0, 4, 13, 'Sansevieria trifasciata', 1, 2, 3, 1),
(61, 1, 4, 1, 0, 1, 7, 'Dracaena sanderiana', 2, 3, 1, 2),
(62, 0, 2, 3, 1, 3, 9, 'Calathea makoyana', 1, 2, 2, 3),
(63, 0, 5, 2, 1, 4, 6, 'Hedera helix', 3, 1, 3, 1),
(64, 1, 1, 1, 0, 2, 10, 'Codiaeum variegatum', 2, 2, 2, 2),
(65, 1, 7, 3, 1, 3, 1, 'Epipremnum aureum', 1, 3, 2, 3),
(66, 0, 6, 2, 0, 4, 2, 'Pelargonium spp.', 2, 4, 3, 1),
(67, 0, 1, 1, 1, 2, 8, 'Rosa chinensis', 3, 3, 1, 2),
(68, 1, 2, 3, 1, 1, 1, 'Zamioculcas zamiifolia', 1, 2, 2, 3),
(69, 1, 3, 2, 0, 4, 5, 'Dianthus caryophyllus', 2, 1, 3, 2);


-- Imágenes para los primeros 10 productos. Va junto a una carpeta de archivos físicos
insert into imagenes_productos (id_producto, ruta) values 
(1, '/estaticos/1_Cipres_1.jpg'),
(1, '/estaticos/1_Cipres_2.jpg'),
(1, '/estaticos/1_Cipres_3.jpg'),
(1, '/estaticos/1_Cipres_4.jpg'),
(2, '/estaticos/2_Espino_1.jpg'),
(2, '/estaticos/2_Espino_2.jpg'),
(2, '/estaticos/2_Espino_3.jpg'),
(2, '/estaticos/2_Espino_4.jpg'),
(3, '/estaticos/3_Grevillea_1.jpg'),
(3, '/estaticos/3_Grevillea_2.jpg'),
(3, '/estaticos/3_Grevillea_3.jpg'),
(3, '/estaticos/3_Grevillea_4.jpg'),
(4, '/estaticos/4_Juniperus_1.jpg'),
(4, '/estaticos/4_Juniperus_2.jpg'),
(4, '/estaticos/4_Juniperus_3.jpg'),
(4, '/estaticos/4_Juniperus_4.jpg'),
(5, '/estaticos/5_Agatea_1.jpg'),
(5, '/estaticos/5_Agatea_2.jpg'),
(5, '/estaticos/5_Agatea_3.jpg'),
(5, '/estaticos/5_Agatea_4.jpg'),
(6, '/estaticos/6_Dolar_1.jpg'),
(6, '/estaticos/6_Dolar_2.jpg'),
(6, '/estaticos/6_Dolar_3.jpg'),
(6, '/estaticos/6_Dolar_4.jpg'),
(7, '/estaticos/7_Pennisetum_1.jpg'),
(7, '/estaticos/7_Pennisetum_2.jpg'),
(7, '/estaticos/7_Pennisetum_3.jpg'),
(7, '/estaticos/7_Pennisetum_4.jpg'),
(8, '/estaticos/8_Sedum_1.jpg'),
(8, '/estaticos/8_Sedum_2.jpg'),
(8, '/estaticos/8_Sedum_3.jpg'),
(8, '/estaticos/8_Sedum_4.jpg'),
(9, '/estaticos/9_Buganvilla_1.jpg'),
(9, '/estaticos/9_Buganvilla_2.jpg'),
(9, '/estaticos/9_Buganvilla_3.jpg'),
(9, '/estaticos/9_Buganvilla_4.jpg'),
(10, '/estaticos/10_Jazmin_1.jpg'),
(10, '/estaticos/10_Jazmin_2.jpg'),
(10, '/estaticos/10_Jazmin_3.jpg'),
(10, '/estaticos/10_Jazmin_4.jpg');