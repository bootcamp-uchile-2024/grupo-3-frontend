import React from 'react';
import { Table } from 'react-bootstrap';
import { ProductAdmin } from '../interfaces/ProductAdmin';

interface ProductTableProps {
  currentProducts: ProductAdmin[]; // Productos filtrados por página
  selectedProduct: ProductAdmin | null; // Producto actualmente seleccionado
  setSelectedProduct: (product: ProductAdmin | null) => void; // Función para actualizar el producto seleccionado
}

const ProductTable: React.FC<ProductTableProps> = ({ currentProducts, selectedProduct, setSelectedProduct }) => {
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

  const rowData = currentProducts.map((product) => [
    product.id,
    product.nombre,
    product.SKU,
    product.categoria.categoria,
    `$${product.precio.toFixed(2)}`,
    product.stock,
    product.unidadesVendidas,
    product.puntuacion.toFixed(1),
  ]);

  // Función para manejar la selección o deselección de un producto
  const handleRowClick = (product: ProductAdmin) => {
    if (selectedProduct?.id === product.id) {
      // Si el producto ya está seleccionado, deseleccionarlo
      setSelectedProduct(null);
    } else {
      // Si el producto no está seleccionado, seleccionarlo
      setSelectedProduct(product);
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
            const product = currentProducts[index]; // Obtener el producto correspondiente
            const isSelected = selectedProduct?.id === product.id; // Verificar si la fila está seleccionada

            return (
              <tr
                key={index}
                onClick={() => handleRowClick(product)} // Manejar el clic en la fila
                style={{
                  backgroundColor: isSelected ? '#D3F9D8' : index % 2 === 0 ? '#FFFFFF' : '#F8F9FA', // Resaltar la fila seleccionada
                  cursor: 'pointer',
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
    </div>
  );
};

export default ProductTable;