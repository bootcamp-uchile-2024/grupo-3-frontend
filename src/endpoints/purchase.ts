import { CartItem } from "../interfaces/CartItem";
import { CartState } from "../states/cartSlice";

// Función para crear un item en el carrito
export const createCartItem = async (cartData: CartItem) => {
    try {
        const response = await fetch('http://localhost:8080/carro-compras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            body: JSON.stringify(cartData),
        });

        if (!response.ok) throw new Error('Error al crear item en el carrito');
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear item:', error);
        throw error;
    }
};

// Función para editar un item en el carrito
export const editCartItem = async (cartData: CartItem) => {
    try {
        const response = await fetch(`http://localhost:8080/carro-compras/${cartData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            body: JSON.stringify(cartData),
        });

        if (!response.ok) throw new Error('Error al editar item en el carrito');
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al editar item:', error);
        throw error;
    }
};

// Función para eliminar un item en el carrito
export const deleteCartItem = async (cartItemId: string) => {
    try {
        const response = await fetch(`http://localhost:8080/carro-compras/${cartItemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            }
        });

        if (!response.ok) throw new Error('Error al eliminar item del carrito');
        
        return { message: 'Item eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar item:', error);
        throw error;
    }
};
