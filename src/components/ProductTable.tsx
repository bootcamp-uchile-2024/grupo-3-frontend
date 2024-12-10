import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { ProductAdmin } from '../interfaces/ProductAdmin';
import CustomPagination from './CustomPagination';
import { Link } from 'react-router-dom';

interface ProductTableProps {
  currentProducts: ProductAdmin[];
  selectedProduct: ProductAdmin | null;
  setSelectedProduct: (product: ProductAdmin | null) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  currentProducts,
  selectedProduct,
  setSelectedProduct,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Manejar el clic en la fila para seleccionar o deseleccionar el producto
  const handleRowClick = (product: ProductAdmin) => {
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null); // Si se hace clic en el producto seleccionado, lo deselecciona
    } else {
      setSelectedProduct(product); // De lo contrario, selecciona este producto
    }
  };

  const pageCount = Math.ceil(currentProducts.length / itemsPerPage);

  const currentPageProducts = currentProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  const columnHeaders = [
    { header: 'ID', width: '5%' },
    { header: 'Nombre', width: '15%' },
    { header: 'SKU', width: '15%' },
    { header: 'Categoría', width: '15%' },
    { header: 'Precio', width: '15%' },
    { header: 'Stock', width: '10%' },
    { header: 'Unidades Vendidas', width: '10%' },
    { header: 'Puntuación', width: '10%' },
  ];

  const rowData = currentPageProducts.map((product) => [
    product.id,
    product.nombre,
    product.SKU,
    product.categoria.categoria,
    `$${product.precio.toFixed(2)}`,
    product.stock,
    product.unidadesVendidas,
    product.puntuacion.toFixed(1),
  ]);

  const handleDeleteProduct = async (productId: number) => {
    const confirmation = window.confirm(`¿Estás seguro de querer eliminar el producto ${productId}?`);
    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:8080/productos/${productId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
        alert(`Eliminaste exitosamente el producto: ${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    } else {
      console.log('Eliminación cancelada');
    }
  };

  return (
    <div className="product-table-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
      <Table responsive hover style={{ borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: '76px' }}>
        <thead>
          <tr>
            {columnHeaders.map((col, index) => (
              <th
                key={index}
                style={{
                  fontFamily: 'Quicksand',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: '13px',
                  color: '#000',
                  textAlign: 'center',
                  borderBottom: '1px solid #BBB',
                  background: '#DCE2D3',
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowData.map((data, index) => {
            const product = currentPageProducts[index];
            return (
              <tr
                key={product.id}
                onClick={() => handleRowClick(product)}  // Maneja el clic en la fila
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedProduct?.id === product.id
                    ? '#6F8F75'  // Color de fondo si el producto está seleccionado
                    : index % 2 === 0
                      ? '#FFFFFF'  // Fila alterna
                      : '#BBB',  // Fila alterna
                  transition: 'background-color 0.3s ease',
                }}
              >
                {data.map((value, idx) => (
                  <td
                    key={idx}
                    style={{
                      borderTop: '1px solid #BBB',
                      textAlign: 'center',
                      padding: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {selectedProduct && (
        <div className="d-flex mt-3 gap-2">
          <Button variant="btn btn-outline-primary" onClick={() => setSelectedProduct(null)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleDeleteProduct(selectedProduct?.id ?? 0)}>
            Eliminar
          </Button>
          <Link to={`/editar-producto/${selectedProduct.id}`}>
            <Button variant="outline-secondary" size="lg">
              Editar
            </Button>
          </Link>
        </div>
      )}

      {/* Paginación personalizada */}
      <div className='d-flex justify-content-center w-100 mt-3' >
        <CustomPagination
          currentPage={currentPage}
          totalPages={pageCount}
          paginate={paginate}
        />
      </div>

    </div>
  );
};

export default ProductTable;

function fetchProducts() {
  throw new Error('Function not implemented.');
}
