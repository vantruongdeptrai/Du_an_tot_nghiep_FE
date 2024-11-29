import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components";
import {
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineSearch,
} from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { Link } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface Order {
  id: string;
  user_id: string;
  total_price: string;
  status_order: string;
  payment_type: string;
  shipping_address: string;
}

const Orders = () => {
  // Áp dụng kiểu dữ liệu cho state orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/orders", {
          method: "GET",
        });
        const data = await response.json();
        console.log(data);

        setOrders(data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Tất Cả Đơn Hàng
              </h2>
              {/* <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>All orders</span>
              </p> */}
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              {/* <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                <AiOutlineExport className="dark:text-whiteSecondary text-blackPrimary text-base" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Export
                </span>
              </button> */}
              {/* <Link
                to="/orders/create-order"
                className="dark:bg-whiteSecondary bg-blackPrimary w-48 py-2 text-lg dark:hover:bg-white hover:bg-blackSecondary duration-200 flex items-center justify-center gap-x-1"
              >
                <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  Add an order
                </span>
              </Link> */}
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              {/* <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Search orders..."
              /> */}
            </div>
            <div>
              {/* <select
                className="w-60 h-10 dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                name="sort"
                id="sort"
              >
                <option value="default">Sort by</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select> */}
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 mt-5">
            {loading ? (
              <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500">
                Không có đơn hàng nào.
              </p>
            ) : (
              <table className="w-full border-collapse border border-gray-300 mt-5">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">
                      ID người dùng
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Tổng tiền
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Trạng thái
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Loại thanh toán
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Địa chỉ giao hàng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        order.status_order === "Đã hủy"
                          ? "bg-red-100 dark:bg-red-900"
                          : ""
                      }`}
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        {order.id}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.user_id || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {parseFloat(order.total_price).toFixed(0)}đ
                      </td>
                      <td
                        className={`border border-gray-300 px-4 py-2 ${
                          order.status_order === "Đã hủy"
                            ? "text-red-600 font-bold dark:text-red-400"
                            : ""
                        }`}
                      >
                        {order.status_order}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.payment_type}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.shipping_address}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          Order Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
