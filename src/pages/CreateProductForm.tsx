import React, { useState } from 'react';
import { createProductData } from '../interfaces/CreateProductData.ts';
/*import fileTypeChecker from 'file-type-checker';*/

const CreateProduct: React.FC = () => {

    const [producto, setProducto] = useState<createProductData>({
        SKU: '',
        nombre: '',
        idCategoria: 1,
        precio: 0,
        descripcion: '',
        imagen: '',
        cantidad: 0,
        unidadesVendidas: 0,
        puntuacion: 1,
        ancho: 0,
        alto: 0,
        largo: 0,
        peso: 0,
    });

    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    // Función para generar SKU
    const generarSKU = (nombre: string, numero: number): string => {
        const letrasSKU = nombre.slice(0, 3).toUpperCase();
        const numeroSKU = String(numero).padStart(3, '0');
        return `${letrasSKU}-${numeroSKU}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Convertir el valor a número si el campo es numérico
        const numericFields = ["precio", "cantidad", "ancho", "alto", "largo", "peso"];
        const parsedValue = numericFields.includes(name) ? (parseFloat(value)) : value;
    
        setProducto((prevProducto) => ({
            ...prevProducto,
            [name]: parsedValue,
        }));
    
        setErrores((prev) => ({
            ...prev,
            [name]: '',
        }));
    };
    /*

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!validarTamanoFichero(file)) {
            alert("El archivo es muy grande");
            event.target.value = '';
            return;
        }

        if (!(await validarTipoFichero(file))) {
            alert("El archivo no es una imagen");
            event.target.value = '';
            return;
        }

        const base64 = await convertirBase64(file);
        setProducto({ ...producto, imagen: base64 });
    };

    const validarTamanoFichero = (file: File) => {
        const limitSize = 1024 * 1024 * 2;
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
    }; */

    const validate = () => {
    
        
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

        if (!producto.ancho || !producto.alto || !producto.largo) {
            newErrors.dimensiones = 'Complete todas las dimensiones';
            isValid = false;
        }

        if (!producto.peso) {
            newErrors.peso = 'Complete el peso';
            isValid = false;
        }

        setErrores(newErrors);
        return isValid;
    };
    //Genera SKU y peticiona a endpoint de crear producto
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (validate()) {
            try {
                // Genera el SKU antes de enviar el producto
                //
                const numeroSecuencial = Date.now(); 
                const SKU = generarSKU(producto.nombre, numeroSecuencial);
                const productoData: createProductData = {
                    SKU,  // El SKU generado
                    nombre: producto.nombre,
                    idCategoria: producto.idCategoria,  // Si está presente
                    precio: producto.precio,
                    descripcion: producto.descripcion,
                    imagen: producto.imagen,  
                    cantidad: producto.cantidad,
                    unidadesVendidas: producto.unidadesVendidas,  // Si está presente
                    puntuacion: producto.puntuacion,  // Si está presente
                    ancho: producto.ancho,
                    alto: producto.alto,
                    largo: producto.largo,
                    peso: producto.peso,
                };
                
                setProducto({ ...producto, SKU });
                console.log("Producto JSON para enviar:", JSON.stringify(productoData));

                const response = await fetch('http://localhost:8080/productos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productoData),
                });
                
                if (!response.ok) throw new Error("Error en la solicitud");
    
                const data = await response.json();
    
                alert(`¡Felicidades! Nuevo producto creado con ID: ${data.id}`);
                setProducto({
                    SKU: '',
                    nombre: '',
                    idCategoria: 1,
                    precio: 0,
                    descripcion: '',
                    imagen: '',
                    cantidad: 0,
                    unidadesVendidas: 0,
                    puntuacion: 1,
                    ancho: 0,
                    alto: 0,
                    largo: 0,
                    peso: 0,
                });
                console.log ("Producto creado: ",productoData)
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
                            type="text"
                            accept="text"
                            id="imagen"
                            className='Create-product-container-inputs'
                            name="imagen"
                            value={producto.imagen}
                            onChange={handleChange}
                           /* onChange={handleFileUpload}*/
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
                        <label htmlFor="Ancho">Ancho en cm:</label>
                        <input
                            type="number"
                            name="ancho"
                            id="ancho"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.ancho}
                        />
                        <label htmlFor="alto">Alto en cm:</label>
                        <input
                            type="number"
                            name="alto"
                            id="alto"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.alto}
                        />
                        <label htmlFor="largo">Largo en cm:</label>
                        <input
                            type="number"
                            name="largo"
                            id="largo"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.largo}
                        />
                        {errores.dimensiones && <p className='Create-product-container-inputs-error'>{errores.dimensiones}</p>}
                    </div>
                    <div>
                        <label htmlFor="peso">Peso en Kg:</label>
                        <input
                            type="number"
                            name="peso"
                            id="peso"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.peso}
                        />
                        {errores.peso && <p className='Create-product-container-inputs-error'>{errores.peso}</p>}
                    </div>
                </div>
                <button type="button" onClick={handleSubmit} className='Create-product-container-button'>
                    Crear Producto
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;