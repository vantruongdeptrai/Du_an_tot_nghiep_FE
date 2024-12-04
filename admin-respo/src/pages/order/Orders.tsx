import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components";
import { Link } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface Order {
  id: string;
  user_id: string;
  user_name?: string; // Thêm trường để lưu tên người dùng
  total_price: string;
  status_order: string;
  payment_type: string;
  shipping_address: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm fetch thông tin người dùng theo ID
  const fetchUserDetails = async (userId: string): Promise<string> => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`);
      const data = await response.json();
      return data.name; // Giả sử API trả về tên người dùng trong `name`
    } catch (error) {
      console.error(
        `Failed to fetch user details for userId: ${userId}`,
        error
      );
      return "Unknown User"; // Trả về tên mặc định nếu xảy ra lỗi
    }
  };

  // Fetch orders và thêm thông tin người dùng
  useEffect(() => {
    const fetchOrdersWithUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/orders");
        const ordersData: Order[] = await response.json();

        // Fetch thông tin tên người dùng cho từng đơn hàng
        const ordersWithUsers = await Promise.all(
          ordersData.map(async (order) => {
            const userName = await fetchUserDetails(order.user_id);
            return { ...order, user_name: userName }; // Gắn tên người dùng vào đơn hàng
          })
        );

        setOrders(ordersWithUsers);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithUsers();
  }, []);

  // Gửi yêu cầu in hóa đơn cho khách hàng
  const handleSendInvoice = async (orderId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/order/${orderId}/invoice`, // Đảm bảo API backend của bạn đã sẵn sàng để xử lý yêu cầu này
        {
          method: "GET", // Sử dụng GET vì đây là hành động lấy hóa đơn
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("Hóa đơn đã được gửi qua email!");
      } else {
        const errorData = await response.json();
        alert(`Không thể gửi hóa đơn. Lỗi: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      alert("Đã xảy ra lỗi khi gửi hóa đơn.");
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
              Tất Cả Đơn Hàng
            </h2>
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
                      Tên người dùng
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
                    <th className="border border-gray-300 px-4 py-2">
                      Hành động
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
                        {order.user_name || "Unknown User"}
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
                      <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                        {" "}
                        {/* Flex container */}
                        {order.status_order === "Giao hàng thành công" && (
                          <button
                            onClick={() => handleSendInvoice(order.id)}
                            className="text-blue-500 hover:underline"
                          >
                            In hóa đơn
                          </button>
                        )}
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
