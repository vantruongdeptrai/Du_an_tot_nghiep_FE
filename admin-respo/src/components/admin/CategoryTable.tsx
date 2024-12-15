import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import useCategory from "../../hooks/category";
import { useState } from "react";
import Loader from "../loader/Loader";

const CategoryTable = () => {
    const { categories, isLoading, deleteCategory } = useCategory();
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 5;
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const categoriesList = Array.isArray(categories) ? categories : [];
    const currentCategories = categoriesList.slice(indexOfFirstCategory, indexOfLastCategory);
    const totalPages = Math.ceil(categoriesList.length / categoriesPerPage);
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
    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    return (
        <div
            style={{
                overflowX: "auto",
                maxWidth: "100%",
            }}
        >
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Danh mục
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Ảnh
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Hành động
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentCategories.map((item, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                {item.name}
                            </td>
                            <td className="px-6 py-4">
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "contain",
                                        borderRadius: "10px",
                                    }}
                                />
                            </td>

                            <td className="px-6 py-4 flex gap-3">
                                <Link
                                    to={`/categories/${item.id}`}
                                    className="flex justify-center items-center w-8 h-8 border border-gray-500 rounded text-gray-800 hover:bg-slate-400"
                                >
                                    <HiOutlinePencil />
                                </Link>
                                <Link
                                    to={`/categories/${item.id}`}
                                    className="flex justify-center items-center w-8 h-8 border border-gray-500 rounded text-gray-800 hover:bg-slate-400"
                                >
                                    <HiOutlineEye />
                                </Link>
                                <button
                                    onClick={() => deleteCategory(`${item.id}`)}
                                    className="flex justify-center items-center w-8 h-8 border border-gray-500 rounded text-gray-800 hover:bg-slate-400"
                                >
                                    <HiOutlineTrash />
                                </button>
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
                        currentPage === 1 ? "bg-gray-200 text-gray-500" : "bg-gray-200 text-black"
                    }`}
                    disabled={currentPage === 1}
                >
                    Trước
                </button>
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`pagination-btn ${
                            currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                        }`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={goToNextPage}
                    className={`pagination-btn ${
                        currentPage === totalPages ? "bg-gray-200 text-gray-500" : "bg-gray-200 text-black"
                    }`}
                    disabled={currentPage === totalPages}
                >
                    Tiếp theo
                </button>
            </div>

            {/* CSS Style cho phân trang */}
            <style>{`
        .category-table-container {
          overflow-x: auto;
          margin-top: 2rem;
        }
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1.5rem;
        }
        .pagination-btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          margin: 0 0.25rem;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .pagination-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .pagination-btn.bg-gray-200 {
          background-color: #e2e8f0;
          color: #6b7280;
        }
        .pagination-btn.bg-blue-500 {
          background-color: #3b82f6;
          color: white;
        }
        .pagination-btn.bg-gray-200.text-black {
          background-color: #e2e8f0;
          color: #1a202c;
        }
        .pagination-btn.bg-blue-500.text-white {
          background-color: #3b82f6;
          color: white;
        }
        .pagination-btn:hover {
          background-color: #a0aec0;
          color: #1a202c;
        }
        .pagination-btn:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        .action-btn:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>
        </div>
    );
};

export default CategoryTable;
