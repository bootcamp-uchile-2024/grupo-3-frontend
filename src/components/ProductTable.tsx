import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { ProductAdmin } from '../interfaces/ProductAdmin';

interface ProductTableProps {
    currentProducts: ProductAdmin[];
    selectedProduct: ProductAdmin | null; 
    setSelectedProduct: (product: ProductAdmin | null) => void; 
    onProductAction?: (id: number) => void; 
    onEditAction?: (product: ProductAdmin) => void; 
}

const ProductTable: React.FC<ProductTableProps> = ({
  currentProducts,
  selectedProduct,
  setSelectedProduct,
  onProductAction,
  onEditAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '1072px',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Table
        responsive
        hover
        style={{
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          width: '100%',
          marginTop: '76px',
        }}
      >
        <thead>
          <tr>
            {[
              { header: 'ID', width: '5%' },
              { header: 'Nombre', width: '15%' },
              { header: 'SKU', width: '15%' },
              { header: 'Categoría', width: '15%' },
              { header: 'Precio', width: '15%' },
              { header: 'Cantidad', width: '10%' },
              { header: 'Unidades Vendidas', width: '10%' },
              { header: 'Puntuación', width: '10%' },
            ].map((col, index) => (
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
          {currentProducts.map((product, index) => (
            <tr
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedProduct?.id === product.id
                  ? '#6F8F75'
                  : index % 2 === 0
                    ? '#FFFFFF !important'
                    : '#BBB !important',
                transition: 'background-color 0.3s ease',
              }}
            >
              {[
                product.id,
                product.nombre,
                product.SKU,
                product.categoria.categoria, // Mostramos la categoría asociada
                `$${product.precio.toFixed(2)}`, // Formateamos el precio
                product.cantidad,
                product.unidadesVendidas,
                product.puntuacion.toFixed(1), // Formateamos la puntuación
              ].map((value, idx) => (
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
          ))}
        </tbody>
      </Table>
      {/* Botones de acción */}
      {selectedProduct && (onProductAction || onEditAction) && (
        <div className="d-flex justify-content-center mt-3 gap-2">
          {onProductAction && (
            <Button
              variant="danger"
              onClick={() => onProductAction(selectedProduct.id)}
            >
              Eliminar
            </Button>
          )}
          {onEditAction && (
            <Button
              variant="primary"
              onClick={() => onEditAction(selectedProduct)}
            >
              Editar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTable;