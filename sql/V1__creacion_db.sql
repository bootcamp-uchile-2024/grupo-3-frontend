-- CREATE database plantai_db;
USE plantai_db;

CREATE table tipo_usuarios(
  id int auto_increment primary key,
  tipo varchar(15) not null
);

CREATE table medio_pago(
  id int auto_increment primary key,
  nombre varchar(20) not null,
  habilitado bool not null
);

CREATE table usuarios(
  id int auto_increment primary key,
  contrasena char(76) not null,
  rut varchar(10) not null,
  id_tipo_usuario int not null,
  nombre_usuario varchar(25) not null,
  nombre varchar(25) not null,    
  apellido varchar(25) not null,
  email varchar(50) not null,
  telefono varchar(12),
  genero varchar(10),
  fecha_nacimiento date,
  foreign key (id_tipo_usuario) references tipo_usuarios(id)
);

CREATE table direcciones(
  id int auto_increment primary key,
  id_usuario int not null,
  comuna varchar(20) not null,
  calle varchar(50) not null,
  numero varchar(5) not null,
  departamento varchar(4),
  referencia varchar(200),
  foreign key (id_usuario) references usuarios(id)
);

CREATE table usuarios_medios_pagos(
  id_usuario int not null,
  id_medio_pago int not null,
  es_preferido bool not null,
  primary key (id_usuario, id_medio_pago),
  foreign key (id_usuario) references usuarios(id),
  foreign key (id_medio_pago) references medio_pago(id)
);

CREATE table etiquetas(
  id int auto_increment primary key,
  etiqueta varchar(50) not null
);

CREATE table categorias(
  id int auto_increment primary key,
  categoria varchar(10) not null
);

CREATE table productos(
  id int auto_increment primary key,
  SKU varchar(20),
  nombre varchar(50),
  id_categoria int not null,
  precio int not null,
  descripcion varchar(2048), 
  imagen varchar(200),
  cantidad int not null,
  unidades_vendidas int, 
  puntuacion decimal(3, 2)  CHECK (puntuacion >= 1 AND puntuacion <= 5),
  ancho int,
  alto int,
  largo int,
  peso int,
  foreign key (id_categoria) references categorias(id)
);

CREATE table productos_etiquetas(
  id_producto int not null,
  id_etiqueta int not null,
  primary key (id_producto, id_etiqueta),
  foreign key (id_producto) references productos(id),
  foreign key (id_etiqueta) references etiquetas(id)
);

CREATE table carros(
  id int auto_increment primary key,
  id_usuario int not null,
  fecha_creacion date not null,
  fecha_cierre date,
  foreign key (id_usuario) references usuarios(id)
);

CREATE table carros_productos(
  id_carro int not null,
  id_producto int not null,
  cantidad_producto int not null,
  primary key (id_carro, id_producto),
  foreign key (id_carro) references carros(id),
  foreign key (id_producto) references productos(id)
);

CREATE table tipo_despacho(
  id int auto_increment primary key,
  tipo varchar(20) not null
);

CREATE table estados_pedido(
  id int auto_increment primary key,
  estado varchar(12) not null
);

CREATE table pedidos(
  id int auto_increment primary key,
  id_usuario int not null,
  fecha_creacion date,
  id_medio_pago int not null,
  id_estado int not null,
  id_tipo_despacho int not null,
  id_carro int not null,
  fecha_entrega date,
  foreign key (id_usuario) references usuarios(id),
  foreign key (id_medio_pago) references medio_pago(id),
  foreign key (id_estado) references estados_pedido(id),
  foreign key (id_tipo_despacho) references tipo_despacho(id),
  foreign key (id_carro) references carros(id)
);

CREATE table pagos(
  id int auto_increment primary key,
  id_medio_pago int not null,
  id_pedido int not null,
  fecha datetime not null, 
  monto int not null,
  foreign key (id_medio_pago) references medio_pago(id),
  foreign key (id_pedido) references pedidos(id)
);

-- Categorías de productos y sus tablas de atributos
CREATE table marcas(
  id int auto_increment primary key,
  nombre varchar(20) not null
);

CREATE table colores_productos(
  id int auto_increment primary key,
  color varchar(12) not null
);

CREATE table plantas_especies(
  id int auto_increment primary key,
  especie varchar(20) not null
);

CREATE table plantas_fotoperiodo(
  id int auto_increment primary key,
  tipo_fotoperiodo varchar(12) not null
);

CREATE table plantas_tipo_riego(
  id int auto_increment primary key,
  tipo_riego varchar(12) not null
);

CREATE table plantas_habito_crecimiento(
  id int auto_increment primary key,
  crecimiento varchar(12) not null
);

CREATE table plantas(
  id_producto int not null primary key,
  id_especie int,
  pet_friendly bool,
  id_tipo_riego int,
  id_fotoperiodo int,
  tolerancia_temperatura int,
  ciclo bool,
  altura varchar(4),
  id_habito_crecimiento int,
  id_color int,
  foreign key (id_producto) references productos(id),
  foreign key (id_especie) references plantas_especies(id),
  foreign key (id_tipo_riego) references plantas_tipo_riego(id),
  foreign key (id_fotoperiodo) references plantas_fotoperiodo(id),
  foreign key (id_habito_crecimiento) references plantas_habito_crecimiento(id),
  foreign key (id_color) references colores_productos(id)
);

CREATE table tipo_maceteros(
  id int auto_increment primary key,
  tipo varchar(20) not null
);

CREATE table maceteros(
  id_producto int not null primary key,
  id_marca int,
  id_tipo_macetero int,
  material varchar(50),
  forma varchar(50),
  diametro int,
  litros int,
  foreign key (id_producto) references productos(id),
  foreign key (id_marca) references marcas(id),
  foreign key (id_tipo_macetero) references tipo_maceteros(id)
);

CREATE table tipo_insumos(
  id int auto_increment primary key,
  tipo_insumo varchar(50) not null
);

CREATE table insumos(
  id_producto int not null primary key,
  id_tipo_insumo int,
  id_marca int,
  foreign key (id_producto) references productos(id),
  foreign key (id_tipo_insumo) references tipo_insumos(id),
  foreign key (id_marca) references marcas(id)
);

CREATE table tipo_accesorios(
  id int auto_increment primary key,
  tipo varchar(50) not null
);

CREATE table accesorios(
  id_producto int not null primary key,
  id_marca int,
  id_tipo_accesorio int,
  id_color int,
  foreign key (id_producto) references productos(id),
  foreign key (id_marca) references marcas(id),
  foreign key (id_tipo_accesorio) references tipo_accesorios(id),
  foreign key (id_color) references colores_productos(id)
);