-- Especies
INSERT INTO plantas_especies (especie)
VALUES  ('Conífera'),
        ('Leguminosa'),
        ('Protácea'),
        ('Cupresáceas'),
        ('Aesteraceae'),
        ('Lamiaceae'),
        ('Poaceae'),
        ('Crasuláceas'),
        ('Nictagináceas'),
        ('Rubiáceas');
-- Plantas_fotoperiodo
INSERT INTO plantas_fotoperiodo (tipo_fotoperiodo)
VALUES ('Día corto'),
		('Día largo'),
		('Neutral');

-- Plantas_habito_crecimiento
-- Editar varchar
ALTER TABLE plantas_habito_crecimiento MODIFY crecimiento VARCHAR(25);

INSERT INTO plantas_habito_crecimiento (crecimiento)
VALUES ('Determinado arbustivo'),
		('Indeterminado arbustivo'),
		('Indeterminado postrado'),
		('Indeterminado trepador');
		
-- Plantas_tipo_riego
-- Editar varchar
ALTER TABLE plantas_tipo_riego MODIFY tipo_riego VARCHAR(25);

INSERT INTO plantas_tipo_riego (tipo_riego)
VALUES ('Riego manual'),
		('Riego goteo'),
		('Riego capilar'),
		('Riego sumersión'),
		('Autorriego'),
		('Nebulización'),
		('Automático');

-- colores_productos
INSERT INTO colores_productos (color)
VALUES ('Verde'),
		('Rojo'),
		('Púrpura'),
		('Burdeo'),
		('Amarillo'),
		('Blanco'),
		('Naranja'),
		('Azul'),
		('Violeta'),
		('Rosa'),
		('Negro'),
		('Marrón'),
		('Variegada');

-- Categorías
INSERT INTO categorias (categoria)
VALUES ('Plantas'),
		('Accesorios'),
		('Macetero'),
		('Insumos');

-- Marcas
INSERT INTO marcas (nombre)
VALUES 
('Mi Mercadito'),
('Dam Garden'),
('Cerio'),
('Proyecto Asombra'),
('DelRioVerde'),
('Tangara'),
('Modo Verde'),
('Pleca'),
('Smiths'),
('Fiskars'),
('SOLO'),
('Truper'),
('Force'),
('Genérico'),
('PRODALAM');

-- tipo_maceteros
INSERT INTO tipo_maceteros (tipo)
VALUES 
('Interior'),
('Exterior'),
('De Bonsái'),
('Autorriego'),
('Colgantes'),
('Drenaje'),
('Biodegradables'),
('Decorativos'),
('Hidroponía'),
('Plantas Trepadoras'),
('Vintage'),
('Semilleros'),
('Apilables');

-- tipo_usuarios
INSERT INTO tipo_usuarios (tipo)
VALUES 
('Super Admin'),
('Admin'),
('Cliente'),
('Visitante');

-- usuarios
INSERT INTO usuarios (contrasena, rut, id_tipo_usuario, nombre_usuario, nombre, apellido, email, telefono, genero, fecha_nacimiento)
VALUES  
('password1', '10422222-2', 1, 'therock', 'Dwayne', 'Johnson',        'dwaynejohnson@gmail.com', '991233221', 'Masculino', '1968-01-01'),
('password2', '10444444-4', 2, 'bigdaddy', 'Daddy', 'Yankee', 'daddyyankee@gmail.com', '999999999', 'Masculino', '1966-10-12'),
('password3', '19123123-2', 3, 'ladydi', 'Diana', 'Gales', 'dianadgales@gmail.com', '123456789', 'Femenino', '1961-07-01');

-- productos de plantas
INSERT INTO productos (SKU, nombre, id_categoria, precio, descripcion, imagen, cantidad, unidades_vendidas, puntuacion, ancho, alto, largo, peso)
VALUES 
('PLANT-CIP-1', 'Ciprés', 1, 5000, 'Planta exterior', 'plantAI.com/imagenes/cipres.jpg',10, 5, 5, 6, 40, 6, 1000),
('PLANT-ESP-2', 'Espino', 1, 10000, 'Planta exterior', 'plantAI.com/imagenes/cipres.jpg',5, 5, 5, 6, 40, 6, 1000),
('PLANT-GR-3', 'Grevillea', 1, 15000, 'Planta ornamental de exterior', 'plantAI.com/imagenes/grevillea.jpg', 10, 12, 4.5, 8, 35, 8, 1200),
('PLANT-JU-4', 'Juniperus-Azul', 1, 18000, 'Planta conífera de exterior', 'plantAI.com/imagenes/juniperus-azul.jpg', 7, 15, 4.8, 9, 45, 10, 1500),
('PLANT-AG-5', 'Agatea Verde', 1, 9000, 'Planta de hojas verdes para exterior', 'plantAI.com/imagenes/agatea-verde.jpg', 8, 10, 4.7, 5, 30, 7, 950),
('PLANT-DO-6', 'Dólar Blanco', 1, 12000, 'Planta de follaje blanco', 'plantAI.com/imagenes/dolar-blanco.jpg', 12, 8, 4.2, 6, 25, 6, 1100),
('PLANT-PE-7', 'Pennisetum Rubra', 1, 13000, 'Planta ornamental de exterior con hojas rubras', 'plantAI.com/imagenes/pennisetum-rubra.jpg', 6, 9, 4.9, 7, 38, 9, 1400),
('PLANT-SE-8', 'Sedum Japonicum', 1, 7000, 'Planta de bajo mantenimiento', 'plantAI.com/imagenes/sedum-japonicum.jpg', 15, 5, 4.1, 4, 22, 5, 850),
('PLANT-BU-9', 'Buganvilla', 1, 20000, 'Planta trepadora de exterior', 'plantAI.com/imagenes/buganvilla.jpg', 4, 18, 4.6, 10, 50, 11, 1700),
('PLANT-JA-10', 'Jazmín del Cabo', 1, 25000, 'Planta de flores blancas aromáticas', 'plantAI.com/imagenes/jazmin-del-cabo.jpg', 5, 20, 4.9, 12, 55, 12, 2000);

-- productos maceteros
INSERT INTO productos (SKU, nombre, id_categoria, precio, descripcion, imagen, cantidad, unidades_vendidas, puntuacion, ancho, alto, largo, peso)
VALUES 
('MAC-CER-1', 'Macetero Cerámica', 3, 5000, 'Macetero de cerámica redondo', 'plantAI.com/imagenes/macer_ceramico.jpg', 10, 5, 5, 30, 30, 30, 1000),
('MAC-PLAS-2', 'Macetero Plástico', 3, 4500, 'Macetero de plástico cuadrado', 'plantAI.com/imagenes/macer_plastico.jpg', 13, 7, 4, 25, 25, 25, 500),
('MAC-MET-3', 'Macetero Metal', 3, 7000, 'Macetero de metal rectangular', 'plantAI.com/imagenes/macer_metal.jpg', 8, 10, 3, 20, 50, 30, 1500),
('MAC-FIB-4', 'Macetero Fibra de vidrio', 3, 6000, 'Macetero de fibra de vidrio cilíndrico', 'plantAI.com/imagenes/macer_fibra_vidri3.jpg', 6, 8, 3, 40, 40, 40, 1200),
('MAC-BAR-5', 'Macetero Barro', 3, 3500, 'Macetero de barro triangular', 'plantAI.com/imagenes/macer_barro.jpg', 5, 9, 4.3, 15, 15, 15, 700),
('MAC-CEM-6', 'Macetero Cemento', 3, 5000, 'Macetero de cemento en forma de cono', 'plantAI.com/imagenes/macer_cem3nto.jpg', 4, 6, 5, 35, 35, 35, 1800),
('MAC-PLAS-7', 'Macetero Plástico', 3, 3000, 'Macetero de plástico en forma de cascada', 'plantAI.com/imagenes/macer_plast3co_cascada.jpg', 9, 5, 5, 50, 50, 50, 900),
('MAC-CER-8', 'Macetero Cerámica', 3, 4800, 'Macetero de cerámica de forma irregular', 'plantAI.com/imagenes/macer_cera3ico_irregular.jpg', 7, 4, 5, 22, 22, 22, 1100),
('MAC-MAD-9', 'Macetero Madera', 3, 5200, 'Macetero de madera colgante', 'plantAI.com/imagenes/macer_ma3era_colgante.jpg', 10, 7, 5, 28, 28, 28, 950),
('MAC-CEM-10', 'Macetero Cemento', 3, 4000, 'Macetero de cemento hexagonal', 'plantAI.com/imagenes/macer_ceme3to_hexagonal.jpg', 6, 3, 5, 45, 45, 45, 1300);
-- productos accesorios
INSERT INTO productos (SKU, nombre, id_categoria, precio, descripcion, imagen, cantidad, unidades_vendidas, puntuacion, ancho, alto, largo, peso)
VALUES
('SUP-PLANT-1', 'Soporte de Planta - Madera', 2, 1500, 'Soporte de madera para plantas de interior', 'plantAI.com/imagenes/soporte_madera.jpg', 50, 30, 4.5, 20, 40, 20, 500),
('MACETA-CER-1', 'Maceta Cerámica Redonda', 2, 5000, 'Maceta de cerámica redonda para interior', 'plantAI.com/imagenes/maceta_ceramica.jpg', 30, 15, 4.8, 30, 30, 30, 1200),
('SUST-ORQ-1', 'Sustrato para Orquídeas', 2, 1200, 'Sustrato especializado para orquídeas', 'plantAI.com/imagenes/sustrato_orquideas.jpg', 100, 45, 4.7, 15, 5, 20, 300),
('HERR-TIJ-1', 'Tijeras de Podar', 2, 2500, 'Tijeras de podar de acero inoxidable', 'plantAI.com/imagenes/tijeras_podar.jpg', 75, 40, 4.9, 5, 25, 2, 150),
('FERT-ORG-1', 'Fertilizante Orgánico', 2, 1800, 'Fertilizante orgánico para todo tipo de plantas', 'plantAI.com/imagenes/fertilizante_organico.jpg', 150, 90, 4.6, 10, 10, 10, 500),
('REG-PLAS-1', 'Regadera de Plástico', 2, 800, 'Regadera de plástico resistente, 1.5L', 'plantAI.com/imagenes/regadera_plastico.jpg', 200, 120, 4.3, 20, 15, 10, 300),
('DECO-EST-1', 'Estatua Decorativa - Buda', 2, 3500, 'Estatua decorativa de Buda para jardines', 'plantAI.com/imagenes/estatua_buda.jpg', 40, 20, 4.5, 15, 15, 40, 2500),
('PLATO-RED-1', 'Plato para Maceta Redondo', 2, 600, 'Plato redondo para macetas de 25cm de diámetro', 'plantAI.com/imagenes/plato_maceta.jpg', 100, 50, 4.4, 25, 25, 2, 400),
('ETIQ-PLA-1', 'Etiquetas para Plantas', 2, 300, 'Etiquetas plásticas para identificar plantas', 'plantAI.com/imagenes/etiquetas_plantas.jpg', 500, 200, 4.2, 5, 1, 10, 50),
('INV-PEQ-1', 'Mini Invernadero', 2, 5500, 'Mini invernadero para terrazas y balcones', 'plantAI.com/imagenes/mini_invernadero.jpg', 15, 10, 4.9, 100, 50, 200, 5000);
-- productos insumos
INSERT INTO productos (SKU, nombre, id_categoria, precio, descripcion, imagen, cantidad, unidades_vendidas, puntuacion, ancho, alto, largo, peso) VALUES
('SUS-TR-1', 'Sustrato', 4, 5000, 'Sustrato ideal para plantas.', 'ruta/a/la/imagen1.jpg', 100, 0, 4.5, 30, 10, 20, 5),
('TUR-B-1', 'Turba', 4, 8000, 'Turba de alta calidad.', 'ruta/a/la/imagen2.jpg', 150, 0, 4.7, 25, 10, 15, 3),
('FIB-CO-1', 'Fibra de coco', 4, 5000, 'Fibra de coco para mejorar el drenaje.', 'ruta/a/la/imagen3.jpg', 200, 0, 4.6, 28, 12, 18, 6),
('FER-ORG-1', 'Fertilizante orgánico', 4, 10000, 'Fertilizante orgánico para un crecimiento saludable.', 'ruta/a/la/imagen4.jpg', 50, 0, 4.8, 20, 5, 10, 4),
('FER-Q-1', 'Fertilizante químico', 4, 8000, 'Fertilizante químico para resultados rápidos.', 'ruta/a/la/imagen5.jpg', 75, 0, 4.2, 22, 6, 12, 4.5),
('NUT-ES-1', 'Nutrientes específicos', 4, 10000, 'Nutrientes específicos para plantas.', 'ruta/a/la/imagen6.jpg', 30, 0, 4.9, 20, 5, 10, 3.5),
('FER-SOL-2', 'Fertilizante soluble', 4, 14000, 'Fertilizante soluble para fácil aplicación.', 'ruta/a/la/imagen7.jpg', 60, 0, 4.4, 18, 5, 9, 2.5),
('COM-P-1', 'Compost', 4, 9000, 'Compost para mejorar la fertilidad del suelo.', 'ruta/a/la/imagen8.jpg', 80, 0, 4.3, 25, 10, 15, 5.5),
('PER-L-1', 'Perlita', 4, 6000, 'Perlita para mejorar el drenaje.', 'ruta/a/la/imagen9.jpg', 120, 0, 4.5, 15, 5, 10, 1.5),
('VERM-C-1', 'Vermiculita', 4, 5500, 'Vermiculita para retención de humedad.', 'ruta/a/la/imagen10.jpg', 110, 0, 4.6, 20, 5, 12, 2),
('ARE-GRV-1', 'Arena y grava', 4, 4500, 'Arena y grava para mezcla de sustratos.', 'ruta/a/la/imagen11.jpg', 130, 0, 4.2, 30, 10, 15, 3),
('CEN-MAD-1', 'Ceniza de madera', 4, 4000, 'Ceniza de madera como fertilizante natural.', 'ruta/a/la/imagen12.jpg', 90, 0, 4.4, 25, 10, 20, 2.5),
('ABO-VER-1', 'Abono verde', 4, 10000, 'Abono verde para enriquecer el suelo.', 'ruta/a/la/imagen13.jpg', 40, 0, 4.7, 22, 6, 12, 3.5),
('INS-NAT-1', 'Insecticida natural', 4, 12000, 'Insecticida natural para el control de plagas.', 'ruta/a/la/imagen14.jpg', 30, 0, 4.8, 20, 5, 10, 4),
('INS-Q-2', 'Insecticida químico', 4, 15000, 'Insecticida químico para plagas resistentes.', 'ruta/a/la/imagen15.jpg', 20, 0, 4.0, 18, 5, 9, 4.5),
('FUNG-C-1', 'Fungicida', 4, 17000, 'Fungicida para el control de enfermedades.', 'ruta/a/la/imagen16.jpg', 25, 0, 4.9, 22, 6, 12, 3),
('HERB-C-2', 'Herbicida', 4, 14000, 'Herbicida para el control de malezas.', 'ruta/a/la/imagen17.jpg', 15, 0, 4.3, 20, 5, 10, 2.5),
('HORM-ENR-3', 'Hormonas de enraizamiento', 4, 13000, 'Hormonas de enraizamiento para plantas.', 'ruta/a/la/imagen18.jpg', 10, 0, 4.6, 25, 10, 15, 3.5),
('BIO-ST-1', 'Bioestimulante', 4, 11000, 'Bioestimulante para mejorar el crecimiento.', 'ruta/a/la/imagen19.jpg', 5, 0, 4.7, 22, 6, 12, 3);

-- plantas
INSERT INTO plantas (id_producto, id_especie, pet_friendly, id_tipo_riego, id_fotoperiodo, tolerancia_temperatura, ciclo, altura, id_habito_crecimiento, id_color)
VALUES 
(1, 1, 1, 1, 2, 32, 1, 40, 2, 1),
(2, 1, 1, 1, 2, 32, 1, 40, 2, 1), -- Grevillea
(3, 2, 2, 2, 3, 35, 1, 50, 1, 2), -- Juniperus-Azul
(4, 3, 1, 2, 2, 28, 2, 60, 3, 3), -- Agatea Verde
(5, 4, 1, 1, 3, 30, 1, 70, 4, 4), -- Dólar Blanco
(6, 5, 2, 2, 1, 34, 2, 80, 1, 5), -- Pennisetum Rubra
(7, 6, 1, 2, 2, 25, 1, 30, 3, 6), -- Sedum Japonicum
(8, 7, 2, 1, 3, 40, 1, 100, 2, 7), -- Buganvilla
(9, 8, 1, 2, 2, 32, 1, 90, 1, 8); -- Jazmín del Cabo

-- maceteros
INSERT INTO maceteros (id_producto, id_marca, id_tipo_macetero, material, forma, diametro)
VALUES 
(11, 2, 11, 'Cerámica', 'Redondo', 30),
(12, 5, 12, 'Plástico', 'Cuadrado', 25),
(13, 8, 13, 'Metal', 'Rectangular', 20),
(14, 3, 10, 'Fibra de vidrio', 'Cilíndrico', 40),
(15, 7, 9, 'Barro', 'Triangular', 15),            
(16, 4, 8, 'Cemento', 'En forma de cono', 35),    
(17, 9, 7, 'Plástico', 'Cascada', 50),            
(18, 1, 6, 'Cerámica', 'Irregular', 22),          
(19, 10, 5, 'Madera', 'Colgante', 28),            
(20, 6, 4, 'Cemento', 'Hexagonal', 45);           

-- tipo_accesorios
INSERT INTO tipo_accesorios (tipo)
VALUES 
('Soporte de planta'),
('Maceta'),
('Sustrato'),
('Herramienta de jardinería'),
('Fertilizante'),
('Sistema de riego'),
('Accesorio decorativo'),
('Plato para macetas'),
('Etiqueta para plantas'),
('Invernadero');

-- accesorios
INSERT INTO accesorios (id_producto, id_marca, id_tipo_accesorio, id_color)
VALUES 
(21, 1, 1, 1),  -- Soporte de Planta - Madera
(22, 2, 2, 2),  -- Sustrato para Orquídeas
(23, 3, 3, 3),  -- Tijeras de Podar
(24, 4, 4, 4),  -- Fertilizante Orgánico
(25, 5, 5, 5),  -- Regadera de Plástico
(26, 6, 6, 6),  -- Estatua Decorativa - Buda
(27, 7, 7, 7),  -- Plato para Maceta Redondo
(28, 8, 8, 8),  -- Etiquetas para Plantas
(29, 9, 9, 9);  -- Mini Invernadero

-- tipo_insumos
INSERT INTO tipo_insumos (tipo_insumo)
VALUES
('Sustrato'),
('Turba'),
('Fibra de coco'),
('Fertilizante orgánico'),
('Fertilizante químico'),
('Nutrientes específicos'),
('Fertilizante soluble'),
('Compost'),
('Perlita'),
('Vermiculita'),
('Arena y grava'),
('Ceniza de madera'),
('Abono verde'),
('Insecticida natural'),
('Insecticida químico'),
('Fungicida'),
('Herbicida'),
('Hormonas de enraizamiento'),
('Bioestimulante');

-- insumos
-- insumos
INSERT INTO insumos (id_producto, id_tipo_insumo, id_marca) VALUES
(31, 1, 1),  -- Sustrato
(32, 2, 2),  -- Turba
(33, 3, 3),  -- Fibra de coco
(34, 4, 4),  -- Fertilizante orgánico
(35, 5, 5),  -- Fertilizante químico
(36, 6, 6),  -- Nutrientes específicos
(37, 7, 7),  -- Fertilizante soluble
(38, 8, 8),  -- Compost
(39, 9, 9),  -- Perlita
(40, 10, 10), -- Vermiculita
(41, 11, 11), -- Arena y grava
(42, 12, 12), -- Ceniza de madera
(43, 13, 13), -- Abono verde
(44, 14, 14), -- Insecticida natural
(45, 15, 15), -- Insecticida químico
(46, 16, 1),  -- Fungicida
(47, 17, 2),  -- Herbicida
(48, 18, 3),  -- Hormonas de enraizamiento
(49, 19, 4);  -- Bioestimulante


-- etiquetas

INSERT INTO etiquetas (etiqueta) VALUES
('Cyber Monday'),
('Black Friday'),
('Navidad'),
('Verano'),
('Primavera'),
('Otoño'),
('Invierno'),
('Descuento'),
('Liquidación'),
('Novedades'),
('Mejores Vendedores'),
('Rebaja Especial'),
('Ecológico'),
('Fácil Cuidado'),
('Apto para Principiantes'),
('Resistente a Plagas'),
('Bajo Consumo de Agua'),
('Sombra'),
('Plantas Medicinales'),
('Regalo Perfecto'),
('Para el Jardín'),
('Interior'),
('Exteriores'),
('Cuidado de Mascotas'),
('Zen'),
('Decoración'),
('Minimalista'),
('Aventurero');

-- productos_etiquetas

INSERT INTO productos_etiquetas (id_producto, id_etiqueta) VALUES 
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 4),
(4, 5), 
(4, 6),
(5, 7), 
(6, 8), 
(7, 9), 
(8, 10), 
(9, 11), 
(10, 12),
(11, 13),
(12, 14),
(13, 15),
(14, 16),
(15, 17),
(16, 18),
(17, 19),
(18, 20),
(19, 21),
(20, 22),
(21, 23),
(22, 24),
(23, 25),
(24, 26),
(25, 27),
(26, 28),
(27, 1),
(28, 2),
(29, 3),
(30, 4),
(31, 5),
(32, 6),
(33, 7),
(34, 8),
(35, 9),
(36, 10),
(37, 11),
(38, 12),
(39, 13),
(40, 14),
(41, 15),
(42, 16),
(43, 17),
(44, 18),
(45, 19),
(46, 20),
(47, 21),
(48, 22);

-- medio_pago
INSERT INTO medio_pago (nombre, habilitado)
VALUES 
('Flow', 1),
('Webpay', 1),
('Mercadopago', 1),
('Khipu', 1);

-- usuario_medio_pago
INSERT INTO usuarios_medios_pagos (id_usuario, id_medio_pago, es_preferido)
VALUES (3, 2, 1);

-- carros
INSERT INTO carros (id_usuario, fecha_creacion)
VALUES (3, '2024-10-22');

-- estado_pedidos
INSERT INTO estados_pedido (estado)
VALUES 
('Confirmado'),
('Pagado'),
('Preparado'),
('Despachado'),
('Entregado'),
('Cerrado'),
('Cancelado'),
('Problema');

-- carros_productos
INSERT INTO carros_productos (id_carro, id_producto, cantidad_producto)
VALUES 
(1, 1, 2),
(1, 19, 2),
(1, 20, 1),
(1, 30, 1);

-- tipo_despacho
INSERT INTO tipo_despacho (tipo)
VALUES 
('Retiro'),
('Chilexpress');

-- pedidos
INSERT INTO pedidos (id_usuario, fecha_creacion, id_medio_pago, id_estado, id_tipo_despacho, id_carro, fecha_entrega)
VALUES 
(1, '2024-10-22', 2, 1, 1, 1, '2024-10-24');

-- pagos
INSERT INTO pagos (id_medio_pago, id_pedido, fecha, monto)
VALUES 
(2, 1, '2024-10-22', 43000);

-- direcciones 
INSERT INTO direcciones (id_usuario, comuna, calle, numero, departamento, referencia)
VALUES 
(1, 'Maipú', 'Pasaje Asturias', 1200, NULL ,'Av Montt con Espectro'),
(2, 'Peñalolén', 'Calle La Maestranza', 342, NULL, 'Calle La Maestranzo al costado de una Copec'),
(3, 'Las Condes', 'Av Apoquindo', 6400, 11, 'Piso 5');