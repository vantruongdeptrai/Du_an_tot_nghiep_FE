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
    <div
      style={{
        overflowX: "auto",
        maxWidth: "100%",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
        className="mt-6 whitespace-nowrap text-left"
      >
        <colgroup>
          <col style={{ width: "60%" }} />
          <col style={{ width: "25%" }} />
          <col style={{ width: "15%" }} />
        </colgroup>
        <thead
          style={{
            backgroundColor: "#f9f9f9",
            borderBottom: "2px solid #ddd",
            color: "#333",
          }}
          className="text-sm leading-6"
        >
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>Danh mục</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Hình ảnh</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((item, index) => (
            <tr
              key={item.id}
              style={{
                backgroundColor: "white",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "white")
              }
            >
              <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                {item.name}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </td>
              <td
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Link
                    to={`/categories/${item.id}`}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "32px",
                      height: "32px",
                      border: "1px solid #999",
                      borderRadius: "4px",
                      backgroundColor: "#fbbf24",
                      color: "#fff",
                      transition: "background-color 0.3s ease",
                    }}
                    className="action-btn"
                  >
                    <HiOutlinePencil />
                  </Link>
                  <Link
                    to={`/categories/${item.id}`}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "32px",
                      height: "32px",
                      border: "1px solid #999",
                      borderRadius: "4px",
                      backgroundColor: "#10b981",
                      color: "#fff",
                      transition: "background-color 0.3s ease",
                    }}
                    className="action-btn"
                  >
                    <HiOutlineEye />
                  </Link>
                  <button
                    onClick={() => deleteCategory(`${item.id}`)}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "32px",
                      height: "32px",
                      border: "1px solid #999",
                      borderRadius: "4px",
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      transition: "background-color 0.3s ease",
                    }}
                    className="action-btn"
                  >
                    <HiOutlineTrash />
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
              ? "bg-gray-200 text-gray-500"
              : "bg-gray-200 text-black"
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
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          className={`pagination-btn ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500"
              : "bg-gray-200 text-black"
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
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f9f9f9;
          font-weight: bold;
          color: #333;
        }
        tr:nth-child(even) {
          background-color: #f5f5f5;
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
