-- Cambia el valor del campo de imagen a null para poder cargar imágenes sin problemas
UPDATE productos 
SET imagen = NULL 
WHERE id BETWEEN 0 AND 50;