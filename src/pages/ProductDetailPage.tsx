import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IProduct } from '../interfaces/IProduct';

export default function ProductDetailPage() {

  const {id} = useParams<{id:string}>();
  const [product, setProduct] = useState<IProduct | null>(null);


  useEffect(() => {

    async function getProduct(){
      try {
        if(!id) return;
        

        try {
          const response = await fetch(`https://fakestoreapi.com/products/${id}`);
          if(!response.ok){
            console.log('No pudimos obtener el producto');
          }

          const productsJson = await response.json();
          console.log('este es el producto: ', productsJson) 
          setProduct(productsJson);

        } catch (error) {
          console.log('Error al obtener el producto');
        }


      } catch (error) {
        console.log('Error al obtener el producto');
      }
    }

    getProduct();
  }, [id]);



  return (
    <>
    <div>ProductDetailPage</div>

    <div className='product-detail-container'>
        <div className='product-image'>
          <img src={product?.image} alt="" />
        </div>
        <div className='product-info'>
        <h1>{product?.title}</h1>
        <p>Price: ${product?.price}</p>
        <p>{product?.description}</p>
      </div>
    </div>

    </>

  )
}
