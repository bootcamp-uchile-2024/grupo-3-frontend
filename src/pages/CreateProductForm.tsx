import React, { useState } from 'react';
import { CreateProductData } from '../interfaces/CreateProductData.ts';
import fileTypeChecker from 'file-type-checker';
import { useEffect } from 'react';

const CreateProduct: React.FC = () => {

    const [producto, setProducto] = useState<CreateProductData>({
        SKU: '',
        nombre: '',
        idCategoria: 1,
        precio: 0,
        descripcion: '',
        imagen: '',
        stock: 0,
        unidadesVendidas: 0,
        puntuacion: 1,
        ancho: 0,
        alto: 0,
        largo: 0,
        peso: 0,
        habilitado: true,
        planta: {
            petFriendly: false,
            ciclo: false,
            especie: '',
            idColor: 1,
            idFotoperiodo: 1,
            idTipoRiego: 1,
            idHabitoCrecimiento: 1,
            idTamano: 1,
            idToleranciaTemperatura: 1,
            idEntorno: 1,
            idIluminacion: 1
        },
        macetero: {
            idMarca: 1,
            idTipoMacetero: 1,
            material: '',
            forma: '',
            diametro: 0,
            litros: 0
        },
        accesorio: {
            idMarca: 1,
            idTipoAccesorio: 1,
            idColor: 1
        },
        insumo: {
            idTipoInsumo: 1,
            idMarca: 1
        }
    });

    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    const categories = [
        { id: 1, name: 'Plantas' },
        { id: 2, name: 'Accesorios' },
        { id: 3, name: 'Insumos' },
        { id: 4, name: 'Maceteros' },
    ];

    useEffect(() => {
        // Dependiendo de la categoría, se actualizan los datos de planta, macetero, accesorio e insumo
        if (producto.idCategoria === 1) { // Plantas
            setProducto((prevProducto) => ({
                ...prevProducto,
                planta: {
                    ...prevProducto.planta,
                    // Poner los valores por defecto para plantas
                    petFriendly: false,
                    ciclo: false,
                    especie: '',
                    idColor: 1,
                    idFotoperiodo: 1,
                    idTipoRiego: 1,
                    idHabitoCrecimiento: 1,
                    idTamano: 1,
                    idToleranciaTemperatura: 1,
                    idEntorno: 1,
                    idIluminacion: 1
                },
                macetero: {
                    ...prevProducto.macetero,
                    idMarca: 1,
                    idTipoMacetero: 1,
                    material: '',
                    forma: '',
                    diametro: 0,
                    litros: 0
                },
                accesorio: {
                    idMarca: 1,
                    idTipoAccesorio: 1,
                    idColor: 1
                },
                insumo: {
                    idTipoInsumo: 1,
                    idMarca: 1
                }
            }));
        } else if (producto.idCategoria === 2) { // Accesorios
            setProducto((prevProducto) => ({
                ...prevProducto,
                planta: { ...prevProducto.planta }, // Dejar planta vacía o ajustarla según sea necesario
                macetero: { ...prevProducto.macetero }, // Ajustar si necesario
                accesorio: {
                    idMarca: 1,
                    idTipoAccesorio: 1,
                    idColor: 1
                },
                insumo: { ...prevProducto.insumo } // Ajustar si necesario
            }));
        } else if (producto.idCategoria === 3) { // Insumos
            setProducto((prevProducto) => ({
                ...prevProducto,
                planta: { ...prevProducto.planta }, // Dejar planta vacía o ajustarla según sea necesario
                macetero: { ...prevProducto.macetero }, // Ajustar si necesario
                accesorio: { ...prevProducto.accesorio }, // Ajustar si necesario
                insumo: {
                    idTipoInsumo: 1,
                    idMarca: 1
                }
            }));
        } else if (producto.idCategoria === 4) { // Maceteros
            setProducto((prevProducto) => ({
                ...prevProducto,
                planta: { ...prevProducto.planta }, // Dejar planta vacía o ajustarla según sea necesario
                macetero: {
                    idMarca: 1,
                    idTipoMacetero: 1,
                    material: '',
                    forma: '',
                    diametro: 0,
                    litros: 0
                },
                accesorio: { ...prevProducto.accesorio }, // Ajustar si necesario
                insumo: { ...prevProducto.insumo } // Ajustar si necesario
            }));
        }
    }, [producto.idCategoria]); // Cuando cambia la categoría, actualiza el estado de acuerdo a la lógica

    // Función para generar SKU
    const generarSKU = (nombre: string, numero: number): string => {
        const letrasSKU = nombre.slice(0, 3).toUpperCase();
        const numeroSKU = String(numero).padStart(3, '0');
        return `${letrasSKU}-${numeroSKU}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Convertir el valor a número si el campo es numérico
        const numericFields = ["precio", "stock", "ancho", "alto", "largo", "peso", "unidadesVendidas"];
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
    };

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

        if (producto.precio <= 10000) {
            newErrors.precio = 'El precio debe ser mayor que $10.000';
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
        if (!producto.idCategoria) {
            newErrors.idCategoria = 'Debe seleccionar una categoría';
            isValid = false;
        }        

        if (producto.stock <= 0) {
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
    
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (validate()) {
            try {
                // Genera el SKU antes de enviar el producto
                const numeroSecuencial = Date.now();
                const SKU = generarSKU(producto.nombre, numeroSecuencial);
                const productoData: CreateProductData = {
                    SKU,  // El SKU generado
                    nombre: producto.nombre,
                    idCategoria: producto.idCategoria,
                    precio: producto.precio,
                    descripcion: producto.descripcion,
                    imagen: producto.imagen,
                    stock: producto.stock,
                    unidadesVendidas: producto.unidadesVendidas,
                    puntuacion: producto.puntuacion,
                    ancho: producto.ancho,
                    alto: producto.alto,
                    largo: producto.largo,
                    peso: producto.peso,
                    habilitado: producto.habilitado,
                    planta: producto.planta,
                    macetero: producto.macetero,
                    accesorio: producto.accesorio,
                    insumo: producto.insumo,
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
                    stock: 0,
                    unidadesVendidas: 0,
                    puntuacion: 1,
                    ancho: 0,
                    alto: 0,
                    largo: 0,
                    peso: 0,
                    habilitado: true,
                    planta: {
                        petFriendly: false,
                        ciclo: false,
                        especie: '',
                        idColor: 1,
                        idFotoperiodo: 1,
                        idTipoRiego: 1,
                        idHabitoCrecimiento: 1,
                        idTamano: 1,
                        idToleranciaTemperatura: 1,
                        idEntorno: 1,
                        idIluminacion: 1
                    },
                    macetero: {
                        idMarca: 1,
                        idTipoMacetero: 1,
                        material: '',
                        forma: '',
                        diametro: 0,
                        litros: 0
                    },
                    accesorio: {
                        idMarca: 1,
                        idTipoAccesorio: 1,
                        idColor: 1
                    },
                    insumo: {
                        idTipoInsumo: 1,
                        idMarca: 1
                    }
                });
                console.log("Producto creado: ", productoData)
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
                        <label htmlFor="idCategoria">Categoría:</label>
                        <select
                            id="idCategoria"
                            name="idCategoria"
                            className='Create-product-container-inputs'
                            value={producto.idCategoria}
                            onChange={handleChange}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errores.idCategoria && <p className='Create-product-container-inputs-error'>{errores.idCategoria}</p>}
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
                        <label htmlFor="stock">Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            id="stock"
                            className='Create-product-container-inputs'
                            onChange={handleChange}
                            value={producto.stock}
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