-- Creación de tabla productos_pedido
Create table productos_pedido(
  id_pedido int,
  id_producto int,
  cantidad int,
  precio_compra int,
  primary key (id_pedido, id_producto),
  foreign key (id_pedido) references pedidos(id),
  foreign key (id_producto) references productos(id)
);

Alter table productos RENAME COLUMN cantidad TO stock;
