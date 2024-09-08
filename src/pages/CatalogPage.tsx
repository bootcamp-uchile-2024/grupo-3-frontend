import React, { useEffect, useState } from 'react'
import { IProduct } from '../interfaces/IProduct';
import { Link } from 'react-router-dom';

export default function CatalogPage() {

  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {

    async function getProducts(){
      try {
        const response = await fetch('https://fakestoreapi.com/products');

        if(!response.ok){
          console.log('No pudimos obtener los productos');
        }
        const productsJson = await response.json();
        console.log(productsJson) 
        setProducts(productsJson);

      } catch (error) {
        console.log('Error al obtener los productos');
      }
    }

    getProducts();
  }, []);


  return (
    <>
      <div>Catalogo de productos</div>
      <br />
      <div className='product-grid'>
        {products.map( product => (
          <div key={product.id} className='product-card'>
            <img src={product.image} alt={product.title} width="100" />
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            <Link to={`/catalog/product/${product.id}`}> Ver detalle</Link>
          </div>
        ))}
      </div>


    </>


  )
}
