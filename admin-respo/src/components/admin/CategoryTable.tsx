import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import useCategory from "../../hooks/category";
import { useState } from "react";

const CategoryTable = () => {
  const { categories, deleteCategory } = useCategory();
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="category-table-container overflow-auto">
      <table className="mt-6 w-full whitespace-nowrap text-left table-auto">
        <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th
              scope="col"
              className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              Category
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
              Image
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
              Slug
            </th>
            <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {currentCategories.map((item) => (
            <tr key={item.id}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                    {item.name}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-20 w-20 rounded-md bg-gray-800"
                  />
                </div>
              </td>
              <td className="py-4 pl-0 pr-8">
                <div className="flex gap-x-3">
                  <div className="text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                    {item.slug}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <Link
                    to={`/categories/${item.id}`}
                    className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </Link>
                  <Link
                    to={`/categories/${item.id}`}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                  >
                    <HiOutlineEye className="text-lg" />
                  </Link>
                  <button
                    onClick={() => deleteCategory(`${item.id}`)}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination-container flex justify-center mt-4">
        <button
          onClick={goToPreviousPage}
          className={`pagination-btn ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500"
              : "bg-gray-300 text-black"
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`pagination-btn ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          className={`pagination-btn ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500"
              : "bg-gray-300 text-black"
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* CSS Style cho phân trang */}
      <style>{`
        /* Phân trang */
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1rem;
        }

        .pagination-btn {
          padding: 0.5rem 1rem;
          margin: 0 0.25rem;
          border-radius: 0.375rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .pagination-btn.bg-gray-300 {
          background-color: #e2e8f0;
          color: #4a5568;
        }

        .pagination-btn.bg-blue-500 {
          background-color: #3b82f6;
          color: white;
        }

        .pagination-btn.bg-gray-300.text-black {
          background-color: #e2e8f0;
          color: #1a202c;
        }

        .pagination-btn.bg-blue-500.text-white {
          background-color: #3b82f6;
          color: white;
        }

        .pagination-btn:hover {
          background-color: #a0aec0;
        }

        .pagination-btn:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CategoryTable;
