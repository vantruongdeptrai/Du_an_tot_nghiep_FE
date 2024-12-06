import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components";
import { Link } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrent";

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
            console.error(`Failed to fetch user details for userId: ${userId}`, error);
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
                            <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
                        ) : (
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tên người dùng
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Tổng tiền
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Loại thanh toán
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Địa chỉ giao hàng
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Hành động
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Trạng thái
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {order.id}
                                            </th>
                                            <td className="px-6 py-4">{order.user_name || "Unknown User"}</td>
                                            <td className="px-6 py-4">{formatCurrency(order.total_price)}</td>
                                            <td
                                                className={`px-6 py-4 ${
                                                    order.status_order === "Đã hủy"
                                                        ? "text-red-600 font-bold"
                                                        : order.status_order === "Giao hàng thành công"
                                                        ? "text-green-600 font-bold"
                                                        : order.status_order === "Chờ xác nhận hủy"
                                                        ? "text-yellow-500 font-bold"
                                                        : "text-blue-500"
                                                }`}
                                            >
                                                {order.status_order}
                                            </td>
                                            <td className="px-6 py-4">{order.payment_type}</td>
                                            <td className="px-6 py-4">{order.shipping_address}</td>
                                            <td className="px-4 py-4 flex flex-col items-center w-60 gap-5">
                                                <div>
                                                    {order.status_order === "Giao hàng thành công" && (
                                                        <button
                                                            type="button"
                                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                        >
                                                            In hóa đơn
                                                        </button>
                                                    )}
                                                </div>

                                                <div>
                                                    <a
                                                        href={`/orders/${order.id}`}
                                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                    >
                                                        Chi tiết
                                                    </a>
                                                </div>
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
