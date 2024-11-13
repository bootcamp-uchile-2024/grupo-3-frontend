import React, { useState } from 'react';
import { createProductData } from '../interfaces/CreateProductData.ts';
import fileTypeChecker from 'file-type-checker';

const CreateProduct: React.FC = () => {
    const [producto, setProducto] = useState<createProductData>({
        nombre: '',
        precio: 0,
        imagen: '',
        descripcion: '',
        cantidad: 0,
        familia: '',
        fotoperiodo: '',
        tipoRiego: '',
        petFriendly: false,
        color: '',
    });

    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: name === 'petFriendly' ? value === 'true' : value });

        setErrores((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    // Función para manejar la carga de archivos y validaciones
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validación de tamaño
        if (!validarTamanoFichero(file)) {
            alert("El archivo es muy grande");
            event.target.value = '';
            return;
        }

        // Validación de tipo
        if (!(await validarTipoFichero(file))) {
            alert("El archivo no es una imagen");
            event.target.value = '';
            return;
        }

        const base64 = await convertirBase64(file);
        setProducto({ ...producto, imagen: base64 });
    };

    const validarTamanoFichero = (file: File) => {
        const limitSize = 1024 * 1024 * 2; // 2MB
        return file.size <= limitSize;
    };

    const validarTipoFichero = async (file: File) => {
        const types = ["jpeg", "png", "gif"];
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        return new Promise<boolean>((resolve, reject) => {
            fileReader.onload = () => resolve(fileTypeChecker.validateFileType(fileReader.result as ArrayBuffer, types));
            fileReader.onerror = (error) => reject(error);
        });
    };

    const convertirBase64 = (file: File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.onerror = (error) => reject(error);
        });
    };

    // Función para las validaciones del formulario
    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        if (!producto.nombre) {
            newErrors.nombre = 'El nombre es requerido';
            isValid = false;
        } else if (producto.nombre.length > 60) {
            newErrors.nombre = 'El nombre no puede ser mayor a 60 caracteres';
            isValid = false;
        }

        if (producto.precio <= 0) {
            newErrors.precio = 'El precio debe ser mayor que 0';
            isValid = false;
        }

        if (!producto.imagen) {
            newErrors.imagen = 'La imagen es requerida';
            isValid = false;
        }

        if (!producto.descripcion) {
            newErrors.descripcion = 'La descripción es requerida';
            isValid = false;
        } else if (producto.descripcion.length > 150) {
            newErrors.descripcion = 'La descripción no puede ser mayor a 150 caracteres';
            isValid = false;
        }

        if (producto.cantidad <= 0) {
            newErrors.cantidad = 'La cantidad debe ser mayor que 0';
            isValid = false;
        }

        if (!producto.familia) {
            newErrors.familia = 'La familia es requerida';
            isValid = false;
        }

        if (!producto.fotoperiodo) {
            newErrors.fotoperiodo = 'El fotoperiodo es requerido';
            isValid = false;
        }

        if (!producto.tipoRiego) {
            newErrors.tipoRiego = 'El tipo de riego es requerido';
            isValid = false;
        }

        if (!producto.color) {
            newErrors.color = 'El color es requerido';
            isValid = false;
        }

        setErrores(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (validate()) {
            try {
                await fetch('http://localhost:8080/productos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(producto),
                });
                alert('¡Felicidades! Nuevo producto creado');
                setProducto({
                    nombre: '',
                    precio: 0,
                    imagen: '',
                    descripcion: '',
                    cantidad: 0,
                    familia: '',
                    fotoperiodo: '',
                    tipoRiego: '',
                    petFriendly: false,
                    color: '',
                });
            } catch (error) {
                console.error("Error al crear el producto: ", error);
            }
        } else {
            alert('Error al enviar el formulario, corrige los campos y vuelve a intentarlo');
        }
    };

    return (
        <div className="Create-product-container">
            <form>
                <h2>Crear Producto </h2>
                <div className='Create-product-container-divs'>
                    <div>
                        <label htmlFor="nombre">Nombre del producto:</label>
                        <input
                            id="nombre"
                            className='Create-product-container-inputs'
                            name="nombre"
                            value={producto.nombre}
                            onChange={handleChange}
                        />
                        {errores.nombre && <p className='Create-product-container-inputs-error'>{errores.nombre}</p>}
                    </div>
                    <div>
                        <label htmlFor="precio">Precio:</label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            className='Create-product-container-inputs'
                            value={producto.precio}
                            onChange={handleChange}
                        />
                        {errores.precio && <p className='Create-product-container-inputs-error'>{errores.precio}</p>}
                    </div>
                    <div>
                        <label htmlFor="imagen">Imagen:</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="imagen"
                            className='Create-product-container-inputs'
                            name="imagen"
                            onChange={handleFileUpload}
                        />
                        {errores.imagen && <p className='Create-product-container-inputs-error'>{errores.imagen}</p>}
                    </div>
                    <div>
                        <label htmlFor="descripcion">Descripción del producto:</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={producto.descripcion}
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            rows={5}
                            cols={40}
                        />
                        {errores.descripcion && <p className='Create-product-container-inputs-error'>{errores.descripcion}</p>}
                    </div>
                    <div>
                        <label htmlFor="cantidad">Cantidad:</label>
                        <input
                            type="number"
                            name="cantidad"
                            id="cantidad"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.cantidad}
                        />
                        {errores.cantidad && <p className='Create-product-container-inputs-error'>{errores.cantidad}</p>}
                    </div>
                    <div>
                        <label htmlFor="familia">Familia:</label>
                        <select
                            name="familia"
                            id="familia"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.familia}
                        >
                            <option value="">Selecciona una familia</option>
                            <option value="familia1">Familia1</option>
                            <option value="familia2">Familia2</option>
                            <option value="familia3">Familia3</option>
                        </select>
                        {errores.familia && <p className='Create-product-container-inputs-error'>{errores.familia}</p>}
                    </div>
                    <div>
                        <label htmlFor="fotoperiodo">Foto periódo:</label>
                        <select
                            name="fotoperiodo"
                            id="fotoperiodo"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.fotoperiodo}
                        >
                            <option value="">Selecciona</option>
                            <option value="fotoperiodo1">Fotoperiodo1</option>
                            <option value="fotoperiodo2">Fotoperiodo2</option>
                            <option value="fotoperiodo3">Fotoperiodo3</option>
                        </select>
                        {errores.fotoperiodo && <p className='Create-product-container-inputs-error'>{errores.fotoperiodo}</p>}
                    </div>
                    <div>
                        <label htmlFor="tipoRiego">Tipo de riego:</label>
                        <select
                            name="tipoRiego"
                            id="tipoRiego"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.tipoRiego}
                        >
                            <option value="">Selecciona</option>
                            <option value="tipoRiego1">tipoRiego1</option>
                            <option value="tipoRiego2">tipoRiego2</option>
                            <option value="tipoRiego3">tipoRiego3</option>
                        </select>
                        {errores.tipoRiego && <p className='Create-product-container-inputs-error'>{errores.tipoRiego}</p>}
                    </div>
                    <div>
                        <label htmlFor="petFriendly">¿El producto es pet friendly?</label>
                        <select
                            name="petFriendly"
                            id="petFriendly"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.petFriendly ? 'true' : 'false'}
                        >
                            <option value="true">Si</option>
                            <option value="false">No</option>
                        </select>
                        {errores.petFriendly && <p className='Create-product-container-inputs-error'>{errores.petFriendly}</p>}
                    </div>
                    <div>
                        <label htmlFor="color">Color del producto: </label>
                        <input
                            type="color"
                            name="color"
                            id="color"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.color}
                        />
                        {errores.color && <p className='Create-product-container-inputs-error'>{errores.color}</p>}
                    </div>
                </div>
                <br />
                <button type="submit" className='Create-product-containerbutton' onClick={handleSubmit}>Crear producto</button>
            </form>
        </div>
    );
};

export default CreateProduct;