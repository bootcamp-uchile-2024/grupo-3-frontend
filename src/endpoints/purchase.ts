import { CartItem } from "../interfaces/CartItem";

export const finalizePurchaseRequest = async (
    
    cartItems: CartItem[],
    userId: number
) => {
    if (cartItems.length === 0) {
        throw new Error("El carrito está vacío. No se puede finalizar la compra.");
    }

    const payload = {
        idUsuario: userId,
        productos: cartItems.map((item) => ({
            productoId: item.id,
            cantidadProducto: item.cantidad,
        })),
    };

    try {
        const response = await fetch('http://localhost:8080/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            body: JSON.stringify(payload),
        });

        console.log('Respuesta del servidor:', response);

        const statusCode = response.status;
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error(errorData.message || 'Error en la finalización de la compra');
        }

        const data = await response.json();
        return { data, statusCode };
    } catch (error) {
        console.error('Error en la finalización de la compra:', error);
        throw error;
    }
};

