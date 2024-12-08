import React, { useState } from 'react';
import { CreateProductData } from '../interfaces/CreateProductData.ts';
import fileTypeChecker from 'file-type-checker';
import { useEffect } from 'react';
import { Image, Form, Button, Row, Col, Container } from 'react-bootstrap';

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
    const [imagePreview, setImagePreview] = useState('');

    const categories = [
        { id: 1, name: 'Plantas' },
        { id: 2, name: 'Accesorios' },
        { id: 3, name: 'Insumos' },
        { id: 4, name: 'Maceteros' },
    ];

    useEffect(() => {
        if (producto.idCategoria === 1) { // Plantas
            setProducto((prevProducto) => ({
                ...prevProducto,
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
            }));
        } else if (producto.idCategoria === 2) { // Accesorios
            setProducto((prevProducto) => ({
                ...prevProducto,
                accesorio: {
                    idMarca: 1,
                    idTipoAccesorio: 1,
                    idColor: 1
                },
            }));
        } else if (producto.idCategoria === 3) { // Insumos
            setProducto((prevProducto) => ({
                ...prevProducto,
                insumo: {
                    idTipoInsumo: 1,
                    idMarca: 1
                }
            }));
        } else if (producto.idCategoria === 4) { // Maceteros
            setProducto((prevProducto) => ({
                ...prevProducto,
                macetero: {
                    idMarca: 1,
                    idTipoMacetero: 1,
                    material: '',
                    forma: '',
                    diametro: 0,
                    litros: 0
                },
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
        setImagePreview(base64);
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
                    planta: producto.idCategoria === 1 ? producto.planta : undefined,
                    macetero: producto.idCategoria === 4 ? producto.macetero : undefined,
                    accesorio: producto.idCategoria === 2 ? producto.accesorio : undefined,
                    insumo: producto.idCategoria === 3 ? producto.insumo : undefined,
                };
                // Elimina las propiedades de categorías no seleccionadas
                if (producto.idCategoria !== 1) {
                    delete productoData.planta;
                }
                if (producto.idCategoria !== 4) {
                    delete productoData.macetero;
                }
                if (producto.idCategoria !== 2) {
                    delete productoData.accesorio;
                }
                if (producto.idCategoria !== 3) {
                    delete productoData.insumo;
                }
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
                setImagePreview('');
                console.log("Producto creado: ", productoData)
            } catch (error) {
                console.error("Error al crear el producto: ", error);
            }
        } else {
            alert('Error al enviar el formulario, corrige los campos y vuelve a intentarlo');
        }
    };

    return (
        <Container>
            <Form>
                <div>
                    {/* Nombre del Producto */}
                    <Form.Group controlId="nombre">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={producto.nombre}
                            onChange={handleChange}
                            isInvalid={!!errores.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.nombre}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Categoría */}
                    <Form.Group controlId="idCategoria">
                        <Form.Label>Categoría:</Form.Label>
                        <Form.Control
                            as="select"
                            name="idCategoria"
                            value={producto.idCategoria}
                            onChange={handleChange}
                            isInvalid={!!errores.idCategoria}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {errores.idCategoria}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Precio */}
                    <Form.Group controlId="precio">
                        <Form.Label>Precio:</Form.Label>
                        <Form.Control
                            type="number"
                            name="precio"
                            value={producto.precio}
                            onChange={handleChange}
                            isInvalid={!!errores.precio}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.precio}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Imagen */}
                    <Form.Group controlId="imagen">
                        <Form.Label>Imagen:</Form.Label>
                        <Form.Control
                            type="file"
                            name="imagen"
                            onChange={handleFileUpload}
                            isInvalid={!!errores.imagen}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.imagen}
                        </Form.Control.Feedback>
                        {/* Previsualización de la imagen */}
                        {imagePreview && (
                            <div className="mt-3">
                                <Image src={imagePreview} alt="Previsualización" thumbnail />
                            </div>
                        )}
                    </Form.Group>

                    {/* Descripción */}
                    <Form.Group controlId="descripcion">
                        <Form.Label>Descripción del producto:</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="descripcion"
                            value={producto.descripcion}
                            onChange={handleChange}
                            rows={5}
                            isInvalid={!!errores.descripcion}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.descripcion}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Stock */}
                    <Form.Group controlId="stock">
                        <Form.Label>Cantidad de Stock:</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            value={producto.stock}
                            onChange={handleChange}
                            isInvalid={!!errores.cantidad}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.cantidad}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Dimensiones */}
                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="ancho">
                                <Form.Label>Ancho en cm:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="ancho"
                                    value={producto.ancho}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="alto">
                                <Form.Label>Alto en cm:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="alto"
                                    value={producto.alto}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="largo">
                                <Form.Label>Largo en cm:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="largo"
                                    value={producto.largo}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {errores.dimensiones && (
                        <p className="Create-product-container-inputs-error">{errores.dimensiones}</p>
                    )}

                    {/* Peso */}
                    <Form.Group controlId="peso">
                        <Form.Label>Peso en gramos:</Form.Label>
                        <Form.Control
                            type="number"
                            name="peso"
                            value={producto.peso}
                            onChange={handleChange}
                            isInvalid={!!errores.peso}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.peso}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="Create-product-container-button"
                >
                    Crear Producto
                </Button>
            </Form>
        </Container>
    );
};

export default CreateProduct;