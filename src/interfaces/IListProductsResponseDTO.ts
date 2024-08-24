interface IListProductsResponseDTO {
    total: number;
    products: ProductDTO[]
}

interface ProductDTO{
    id: number;
    name: string;
    price: number;
}