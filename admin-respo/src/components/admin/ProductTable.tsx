import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import useProduct from "../../hooks/product";
import useCategory from "../../hooks/category";
import { useState } from "react";

const ProductTable = () => {
  const { products, deleteProduct } = useProduct();
  const { categories } = useCategory();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id == categoryId);
    return category ? category.name : "Không xác định";
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);
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
    <div className="overflow-auto">
      <table className="mt-6 w-full whitespace-nowrap text-left table-auto">
        <colgroup>
          <col className="w-4/12" />
          <col className="w-4/12" />
          <col className="w-3/12" />
          <col className="w-3/12" />
          <col className="w-3/12" />
          <col className="w-3/12" />
          <col className="w-3/12" />
          <col className="w-3/12" />
        </colgroup>
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th scope="col" className="py-2 pl-4 pr-8 font-semibold">
              Sản phẩm
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
              Mô tả
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
              Giá
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
              Danh mục
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
              Sản phẩm mới
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
              Sản phẩm bán chạy
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold">
              Sản phẩm nổi bật
            </th>
            <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {currentProducts.map((item) => (
            <tr key={item.id}>
              <td className="py-4 pl-4 pr-8">
                <div className="flex items-center gap-x-4">
                  <img
                    src={item.image_url}
                    alt=""
                    className="h-8 w-8 rounded-full bg-gray-800"
                  />
                  <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                    {item.name}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4">
                <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary w-20 truncate">
                  {item.description}
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-sm leading-6">
                <div className="dark:text-whiteSecondary text-blackPrimary block">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0, // Không hiển thị phần thập phân
                    maximumFractionDigits: 0, // Không hiển thị phần thập phân
                  }).format(item.price)}
                </div>
              </td>
              <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium">
                {getCategoryName(`${item.category_id}`)}
              </td>
              <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium">
                {item.new_product ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                )}
              </td>
              <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium">
                {item.best_seller_product ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                )}
              </td>
              <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium">
                {item.featured_product ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                )}
              </td>
              <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                <div className="flex gap-x-1 justify-end">
                  <Link
                    to={`/product/edit/${item.id}`}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </Link>
                  <Link
                    to={`/product/detail/${item.id}`}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                  >
                    <HiOutlineEye className="text-lg" />
                  </Link>
                  <button
                    onClick={() => deleteProduct(`${item.id}`)}
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
      <div className="flex justify-center mt-4">
        <button
          onClick={goToPreviousPage}
          className={`px-4 py-2 mx-1 ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500"
              : "bg-gray-300 text-black"
          } rounded`}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-4 py-2 mx-1 ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            } rounded`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          className={`px-4 py-2 mx-1 ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500"
              : "bg-gray-300 text-black"
          } rounded`}
          disabled={currentPage === totalPages}
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default ProductTable;
