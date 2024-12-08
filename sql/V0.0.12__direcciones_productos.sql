-- Creación columnas para Pedidos
-- Creación tabla para direcciones de envío por pedido

-- Ahora PLantas debería tener esta forma:

  -- id_producto int not null primary key,
  -- especie varchar(50)
  -- pet_friendly bool,
  -- id_tipo_riego int,
  -- id_fotoperiodo int,
  -- id_tolerancia_temperatura int,
  -- ciclo bool,
  -- id_tamaño int,
  -- id_entorno int,
  -- id_iluminacion int,
  -- id_habito_crecimiento int,
  -- id_color int,
  -- foreign key (id_producto) references productos(id),
  -- foreign key (id_tipo_riego) references plantas_tipo_riego(id),
  -- foreign key (id_fotoperiodo) references plantas_fotoperiodo(id),
  -- foreign key (id_habito_crecimiento) references plantas_habito_crecimiento(id),
  -- foreign key (id_tamaño) references plantas_tamaño(id),
  -- foreign key (id_entorno) references plantas_entorno(id),
  -- foreign key (id_iluminacion) references plantas_iluminacion(id)



ALTER TABLE pedidos ADD COLUMN receptor varchar(50);

CREATE table direcciones_envio(
  id_pedido int primary key not null,
  comuna varchar(20) not null,
  calle varchar(50) not null,
  numero varchar(5) not null,
  departamento varchar(4),
  referencia varchar(200),
  foreign key (id_pedido) references pedidos(id)
);


-- *Nombre Especie -> (Ahora es solo un string)
ALTER TABLE plantas DROP FOREIGN KEY plantas_ibfk_2;
ALTER TABLE plantas DROP COLUMN id_especie;
ALTER TABLE plantas ADD COLUMN especie varchar(50);


-- *IDTolerancia Temperatura / Tolerancia Temperatura
CREATE table plantas_tolerancia_temperatura(
  id int auto_increment primary key,
  tolerancia_temperatura varchar(12) not null
);

ALTER TABLE plantas DROP COLUMN tolerancia_temperatura;
ALTER TABLE plantas ADD COLUMN id_tolerancia_temperatura int;
ALTER TABLE plantas ADD FOREIGN KEY (id_tolerancia_temperatura) REFERENCES plantas_tolerancia_temperatura(id);


-- *Altura -> ID Tamaño / Tamaño
CREATE table plantas_tamaño(
  id int auto_increment primary key,
  tamaño varchar(4) not null
);

ALTER TABLE plantas DROP COLUMN altura;
ALTER TABLE plantas ADD COLUMN id_tamaño int;
ALTER TABLE plantas ADD FOREIGN KEY (id_tamaño) REFERENCES plantas_tamaño(id);


-- * IDEntorno / Entorno
CREATE table plantas_entorno(
  id int auto_increment primary key,
  entorno varchar(30) not null
);

ALTER TABLE plantas ADD COLUMN id_entorno int;
ALTER TABLE plantas ADD FOREIGN KEY (id_entorno) REFERENCES plantas_entorno(id);


-- * IDIluminación / Iluminación
CREATE table plantas_iluminacion(
  id int auto_increment primary key,
  iluminacion varchar(20) not null
);

ALTER TABLE plantas ADD COLUMN id_iluminacion int;
ALTER TABLE plantas ADD FOREIGN KEY (id_iluminacion) REFERENCES plantas_iluminacion(id);


-- Datos para las tablas nuevas
INSERT INTO plantas_tolerancia_temperatura (tolerancia_temperatura)
VALUES ('Cálido'),
    ('Templado'),
		('Frío');

INSERT INTO plantas_tamaño (tamaño)
VALUES ('S'),
		('M'),
		('L'),
		('XL');

INSERT INTO plantas_entorno (entorno)
VALUES ('Interior'),
		('Exterior'),
		('Misxo');

INSERT INTO plantas_iluminacion (iluminacion)
VALUES ('Sol Directo'),
		('Semi Sombra'),
		('Sombra');


-- Datos para plantas guardadas

UPDATE plantas
SET id_tolerancia_temperatura = 3, id_iluminacion = 1, id_entorno = 2, id_tamaño = 4, especie = 'Conífera'
WHERE id_producto = 1;

UPDATE plantas
SET id_tolerancia_temperatura = 3, id_iluminacion = 1, id_entorno = 2, id_tamaño = 4, especie = 'Leguminosa'
WHERE id_producto = 2;

UPDATE plantas
SET id_tolerancia_temperatura = 3, id_iluminacion = 1, id_entorno = 2, id_tamaño = 4, especie = 'Protácea'
WHERE id_producto = 3;

UPDATE plantas
SET id_tolerancia_temperatura = 3, id_iluminacion = 1, id_entorno = 2, id_tamaño = 3, especie = 'Cupresáceas'
WHERE id_producto = 4;

UPDATE plantas
SET id_tolerancia_temperatura = 3, id_iluminacion = 1, id_entorno = 2, id_tamaño = 2, especie = 'Aesteraceae'
WHERE id_producto = 5;

UPDATE plantas
SET id_tolerancia_temperatura = 2, id_iluminacion = 2, id_entorno = 1, id_tamaño = 1, especie = 'Lamiaceae'
WHERE id_producto = 6;

UPDATE plantas
SET id_tolerancia_temperatura = 3, id_iluminacion = 3, id_entorno = 2, id_tamaño = 2, especie = 'Poaceae'
WHERE id_producto = 7;

UPDATE plantas
SET id_tolerancia_temperatura = 2, id_iluminacion = 2, id_entorno = 1, id_tamaño = 1, especie = 'Crasuláceas'
WHERE id_producto = 8;

UPDATE plantas
SET id_tolerancia_temperatura = 3, id_iluminacion = 1, id_entorno = 2, id_tamaño = 4, especie = 'Nictagináceas'
WHERE id_producto = 9;
