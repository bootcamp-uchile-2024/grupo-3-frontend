import React from 'react';
import { Table } from 'react-bootstrap';
import { ProductAdmin } from '../interfaces/ProductAdmin';
import "../styles/ProductTableStyle.css";

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
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };


  return (
    <div className="product-table-container">
      <Table responsive className="product-table">
        <thead>
          <tr>
            {columnHeaders.map((col, index) => (
              <th key={index} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowData.map((data, index) => {
            const product = currentProducts[index];
            const isSelected = selectedProduct?.id === product.id;
            const rowClass = isSelected ? 'selected-product' : index % 2 === 0 ? '' : 'even-row-notselected';

            return (
              <tr key={index} onClick={() => handleRowClick(product)} className={rowClass}>
                {data.map((value, idx) => (
                  <td key={idx}>{value}</td>
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