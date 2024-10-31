import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = [...Array(totalPages)].map((_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4">
      <nav className="flex space-x-2">
        {pages.map(page => (
          <button
            key={page}
            className={`px-3 py-1 rounded ${
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Pagination;
