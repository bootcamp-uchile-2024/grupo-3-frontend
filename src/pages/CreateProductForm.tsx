import React, { useState } from 'react';
import { CrearProductoData } from '../interfaces/CrearProductoData';

const CrearProducto: React.FC = () => {
    const [producto, setProducto] = useState<CrearProductoData>({
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

        setProducto((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar error del campo modificado
        setErrores((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            console.log('Datos del formulario:', producto)
        } else {
            console.log('Error al completar el formulario');
        };
    };

    return (
        <div className="Create-product-container">
            <form onSubmit={handleSubmit}>
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
                            required
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
                            min={0}
                            required
                        />
                        {errores.precio && <p className='Create-product-container-inputs-error'>{errores.precio}</p>}
                    </div>
                    <div>
                        <label htmlFor="imagen">Imagen (URL):</label>
                        <input
                            type="url"
                            id="imagen"
                            className='Create-product-container-inputs'
                            name="imagen"
                            value={producto.imagen}
                            onChange={handleChange}
                            required
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
                            required
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
                            required
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
                            required
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
                            required
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
                            required
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
                            required
                        />
                        {errores.color && <p className='Create-product-container-inputs-error'>{errores.color}</p>}
                    </div>
                </div>
                <br />
                <button type="submit" className='Create-product-containerbutton'>Crear producto</button>
            </form>
        </div>
    );
};

export default CrearProducto;