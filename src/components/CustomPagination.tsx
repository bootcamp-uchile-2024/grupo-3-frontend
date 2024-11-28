import React from 'react';
import Button from 'react-bootstrap/Button';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
      {/* Botón de flecha izquierda */}
      <Button
        variant="link"
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        disabled={currentPage <= 1}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
          opacity: currentPage > 1 ? 1 : 0.5,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="#466A76" />
          <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" stroke="#466A76" />
          <path d="M25 32.5L12.5 20L25 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {/* Texto de la página actual */}
      <span
        style={{
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color: '#1A4756',
          textAlign: 'center',
          minWidth: '80px',
        }}
      >
        Página {currentPage} de {totalPages}
      </span>

      {/* Botón de flecha derecha */}
      <Button
        variant="link"
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
        disabled={currentPage >= totalPages}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
          opacity: currentPage < totalPages ? 1 : 0.5,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="#466A76" />
          <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" stroke="#466A76" />
          <path d="M15 7.5L27.5 20L15 32.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
    </div>
  );
};

export default CustomPagination;




