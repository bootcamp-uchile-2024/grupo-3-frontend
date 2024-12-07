ALTER TABLE tipo_usuarios RENAME TO roles;
ALTER TABLE usuarios RENAME COLUMN id_tipo_usuario TO id_rol;
ALTER TABLE usuarios DROP FOREIGN KEY usuarios_ibfk_1;
ALTER TABLE usuarios ADD CONSTRAINT usuarios_ibfk_1 FOREIGN KEY (id_rol) REFERENCES roles(id);
ALTER TABLE roles CHANGE COLUMN tipo nombre VARCHAR(15) NOT NULL;
