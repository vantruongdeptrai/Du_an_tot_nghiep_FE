import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import axios from "axios";
import { Category } from "../api/categories/types";

const CategoryTable: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Category[]>(
        "http://localhost:8000/api/categories"
      );
      console.log(response.data); // Kiểm tra dữ liệu nhận được
      setCategories(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Thông báo lỗi:", err.message);
        setError(`Lỗi mạng: ${err.message}`);
      } else {
        console.error("Lỗi không mong đợi:", err);
        setError("Không thể lấy danh mục");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
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
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Slug
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {categories.map((item) => (
          <tr key={item.id}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-8 w-8 rounded-full bg-gray-800"
                />
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {item.name}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 table-cell pr-8">
              <div className="flex gap-x-3">
                <div className="text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {item.slug}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link
                  to={`/categories/${item.id}/edit`}
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
                <Link
                  to="#"
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                >
                  <HiOutlineTrash className="text-lg" />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;
