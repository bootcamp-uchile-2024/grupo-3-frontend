ALTER TABLE productos ADD COLUMN habilitado BOOLEAN;

UPDATE productos
SET habilitado = TRUE;