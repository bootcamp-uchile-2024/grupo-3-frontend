import React from 'react';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
      <button
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
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
      </button>

      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1A4756' }}>
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
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
      </button>
    </div>
  );
};

export default CustomPagination;

