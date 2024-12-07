ALTER TABLE productos_etiquetas DROP FOREIGN KEY productos_etiquetas_ibfk_1;
ALTER TABLE productos_etiquetas DROP FOREIGN KEY productos_etiquetas_ibfk_2;

ALTER TABLE productos_etiquetas
  ADD CONSTRAINT productos_etiquetas_ibfk_1 FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
  ADD CONSTRAINT productos_etiquetas_ibfk_2 FOREIGN KEY (id_etiqueta) REFERENCES etiquetas(id) ON DELETE CASCADE;