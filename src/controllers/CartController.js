import { UpdateCarroCompraDTO } from './interfaces/UpdateCarroCompraDTO';

async function actualizarCarrito(carritoDTO: UpdateCarroCompraDTO) {
    try {
        const response = await fetch(`https://api.ejemplo.com/carritos/${carritoDTO.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                agregarProductos: carritoDTO.agregarProductos,
                quitarProductos: carritoDTO.quitarProductos
            })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el carrito');
        }

        const carritoActualizado = await response.json();
        console.log('Carrito actualizado:', carritoActualizado);
    } catch (error) {
        console.error('Error en la actualización del carrito:', error);
    }
}

export default actualizarCarrito;

