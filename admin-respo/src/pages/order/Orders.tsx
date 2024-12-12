import { Sidebar } from "../../components";
import { Link } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrent";
import useFetchOrders from "../../hooks/orders";
import Loader from "../../components/loader/Loader";

const Orders = () => {
    // Fetch danh sách đơn hàng
    const { orders, isLoading } = useFetchOrders();
    const sortOrder =
        orders && Array.isArray(orders)
            ? [...orders].sort((a, b) => {
                  // Đảm bảo id là kiểu số để sắp xếp chính xác
                  return Number(b.id) - Number(a.id); // Giảm dần
              })
            : [];

    // Gửi hóa đơn
    const handleSendInvoice = async (orderId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/order/${orderId}/invoice`, { method: "GET" });
            if (response.ok) {
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

    if (isLoading) {
        return (
            <p>
                <Loader />
            </p>
        );
    }

    if (!orders || orders.length === 0) {
        return <p className="text-center text-gray-500">Không có đơn hàng nào.</p>;
    }

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
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">STT</th>
                                    <th className="px-6 py-3">Tên người dùng</th>
                                    <th className="px-6 py-3">Tổng tiền</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3">Loại thanh toán</th>
                                    <th className="px-6 py-3">Địa chỉ giao hàng</th>
                                    <th className="px-6 py-3">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortOrder.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    >
                                        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {order.id}
                                        </th>
                                        <td className="px-6 py-4">{order.name_order}</td>
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
                                        <td className="px-2 py-2 flex flex-col items-center gap-5">
                                            {/* {order.status_order === "Giao hàng thành công" && (
                                                <button
                                                    onClick={() => handleSendInvoice(order.id)}
                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                >
                                                    Gửi hóa đơn
                                                </button>
                                            )} */}
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                            >
                                                Chi tiết
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
