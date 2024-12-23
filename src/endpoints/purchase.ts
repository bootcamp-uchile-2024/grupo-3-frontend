import { CartItem } from "../interfaces/CartItem";
import { CartState } from "../states/cartSlice";

export const finalizePurchaseRequest = async (cartData: CartItem[]) => {
    const cartState: CartState = {
        idUsuario:1,
        productos: cartData
    };

    
    try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/carro-compras`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'

            },
            body: JSON.stringify(cartState),
        });
        
        console.log('Respuesta del servidor:', response); // Verifica la respuesta
        
        const statusCode = response.status;
        if (!response.ok) {
            throw new Error('Error en la finalización de la compra');
        }

        const data = await response.json();
        return {data, statusCode}; // Retorna la respuesta del servidor si es exitosa.
    } 
    catch (error) {
        console.error('Error en la finalización de la compra:', error);
        throw error; // Lanza el error para manejarlo en el componente.
    }
};
