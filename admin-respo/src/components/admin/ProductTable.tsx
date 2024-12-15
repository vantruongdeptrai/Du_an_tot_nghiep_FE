import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import useProduct from "../../hooks/product";
import useCategory from "../../hooks/category";
import { useState } from "react";
import formatCurrency from "../../utils/formatCurrent";
import Loader from "../loader/Loader";
// import { Product } from "../../api/products/types";
const ProductTable = () => {
    const { products, isLoading, deleteProduct } = useProduct();
    const { categories } = useCategory();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const safeProducts = Array.isArray(products) ? products : [];

    const getCategoryName = (categoryId: string) => {
        if (!categories) return "Không xác định";
        const category = categories.find((cat) => cat.id == categoryId);
        return category ? category.name : "Không xác định";
    };

    // const calculateMinMaxPrices = (productVariants: Product["product_variants"]) => {
    //     const prices = productVariants
    //         .map((variant) => parseFloat(variant.price || "0"))
    //         .filter((price) => !isNaN(price));
    //     const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    //     const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    //     return { minPrice, maxPrice };
    // };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = safeProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(safeProducts.length / productsPerPage);
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
        <div className="overflow-auto">
            <>
                {/* Hello world */}
                <div className="">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Sản phẩm
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Ảnh
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mô tả
                                </th>
                                {/* <th scope="col" className="px-6 py-3">
                                    Giá
                                </th> */}
                                <th scope="col" className="px-6 py-3">
                                    Danh mục
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sản phẩm mới
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sản phẩm bán chạy
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sản phẩm nổi bật
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((item) => {
                                // const { minPrice, maxPrice } = calculateMinMaxPrices(item.product_variants);
                                return (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {item.name.length > 30
                                                ? `${item.name.slice(0, 30)}...` // Giới hạn hiển thị tối đa 50 ký tự
                                                : item.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            <img
                                                src={item.image_url}
                                                alt=""
                                                className="h-8 w-8 rounded-full bg-gray-800"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.description.length > 30
                                                ? `${item.description.slice(0, 100)}...` // Giới hạn hiển thị tối đa 50 ký tự
                                                : item.description}
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            {minPrice === maxPrice
                                                ? formatCurrency(minPrice)
                                                : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                                        </td> */}
                                        <td className="px-6 py-4">{getCategoryName(`${item.category_id}`)}</td>
                                        <td className="px-6 py-4">
                                            {item.new_product ? (
                                                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                                            ) : (
                                                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.best_seller_product ? (
                                                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                                            ) : (
                                                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.featured_product ? (
                                                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                                            ) : (
                                                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-x-1 justify-end">
                                                <Link
                                                    to={`/product/edit/${item.id}`}
                                                    className="flex justify-center items-center w-8 h-8 border border-gray-500 rounded text-gray-800 hover:bg-slate-400"
                                                >
                                                    <HiOutlinePencil className="text-lg" />
                                                </Link>
                                                <Link
                                                    to={`/product/detail/${item.id}`}
                                                    className="flex justify-center items-center w-8 h-8 border border-gray-500 rounded text-gray-800 hover:bg-slate-400"
                                                >
                                                    <HiOutlineEye className="text-lg" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteProduct(`${item.id}`)}
                                                    className="flex justify-center items-center w-8 h-8 border border-gray-500 rounded text-gray-800 hover:bg-slate-400"
                                                >
                                                    <HiOutlineTrash className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </>

            {/* Phân trang */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={goToPreviousPage}
                    className={`px-4 py-2 mx-1 ${
                        currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-gray-300 text-black"
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
                            currentPage === number ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                        } rounded`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={goToNextPage}
                    className={`px-4 py-2 mx-1 ${
                        currentPage === totalPages ? "bg-gray-300 text-gray-500" : "bg-gray-300 text-black"
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
