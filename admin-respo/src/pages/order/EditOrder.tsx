import { AiOutlineSave } from "react-icons/ai";
import { Sidebar } from "../../components";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrderAndUpdate } from "../../hooks/orderDetails";
import { toast } from "react-toastify";

const EditOrder = () => {
    const { id } = useParams<{ id: string }>();
    const { orderDetailsQuery, updateOrderStatusMutation } = useOrderAndUpdate(id || "");
    const { data, isLoading } = orderDetailsQuery;
    console.log(data);
    
    const [inputObject, setInputObject] = useState({
        customerName: "",
        phoneNumber: "",
        emailAddress: "",
        orderNotice: "",
        products: [],
        totalPrice: 0,
        statusOrder: "",
        paymentType: "",
        shippingAddress: "",
        cancel_reason: "",
    });
    const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);

    useEffect(() => {
        if (data) {
            setInputObject({
                customerName: data.order.user_name,
                phoneNumber: data.order.phone_order,
                emailAddress: data.order.email_order,
                orderNotice: data.order.user_note,
                products: data.products,
                totalPrice: parseFloat(data.order.total_price),
                statusOrder: data.order.status_order,
                paymentType: data.order.payment_type,
                shippingAddress: data.order.shipping_address,
                cancel_reason: data.order.cancel_reason || "",
            });
            updateAvailableStatuses(data.order.status_order);
        }
    }, [data]);

    const updateAvailableStatuses = (status: string) => {
        switch (status) {
            case "Chờ xác nhận":
                setAvailableStatuses(["Chờ xác nhận", "Đã xác nhận", "Đã hủy"]);
                break;
            case "Đã xác nhận":
                setAvailableStatuses(["Đã xác nhận", "Đang chuẩn bị"]);
                break;
            case "Đang chuẩn bị":
                setAvailableStatuses(["Đang chuẩn bị", "Đang vận chuyển"]);
                break;
            case "Đang vận chuyển":
                setAvailableStatuses(["Đang vận chuyển", "Giao hàng thành công"]);
                break;
            case "Chờ xác nhận hủy":
                setAvailableStatuses(["Chờ xác nhận hủy", "Chờ xác nhận", "Đã hủy"]);
                break;
            case "Giao hàng thành công":
                setAvailableStatuses(["Giao hàng thành công"]);
                break;
            case "Đã hủy":
                setAvailableStatuses(["Đã hủy"]);
                break;
            default:
                setAvailableStatuses([]);
        }
    };

    const handleUpdateOrderStatus = () => {
        // Kiểm tra xem trạng thái hiện tại và trạng thái mới có giống nhau không
        if (orderDetailsQuery.data?.order?.status_order === inputObject.statusOrder) {
            toast.warn("Trạng thái đơn hàng hiện tại giống với trạng thái mới. Không cần cập nhật.");
            return;
        }
        updateOrderStatusMutation.mutate({
            id: id || "",
            statusOrder: inputObject.statusOrder,
            cancelReason: inputObject.statusOrder === "Chờ xác nhận hủy" ? inputObject.cancel_reason : undefined,
        });
        toast.success("Cập nhật trạng thái thành công.");
    };

    if (isLoading) return <p>Đang tải...</p>;

    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
                <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
                    <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
                        <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                            Chi tiết đơn hàng {id}
                        </h2>
                    </div>

                    {/* Form và các trường thông tin */}
                    <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-rows-1 md:grid-rows-2 gap-10">
                        <div className="border p-6 rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mb-4">
                                Thông tin đơn hàng
                            </h3>

                            <table className="w-full table-auto border-collapse text-sm md:text-base">
                                <tbody>
                                    <tr className="border-b hover:bg-gray-100">
                                        <td className="font-semibold text-gray-700 py-2 px-4">Tên khách hàng:</td>
                                        <td className="text-gray-600 py-2 px-4">{inputObject.customerName}</td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-100">
                                        <td className="font-semibold text-gray-700 py-2 px-4">Số điện thoại :</td>
                                        <td className="text-gray-600 py-2 px-4">{inputObject.phoneNumber}</td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-100">
                                        <td className="font-semibold text-gray-700 py-2 px-4">Địa chỉ email:</td>
                                        <td className="text-gray-600 py-2 px-4">{inputObject.emailAddress}</td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-100">
                                        <td className="font-semibold text-gray-700 py-2 px-4">Ghi chú :</td>
                                        <td className="text-gray-600 py-2 px-4">{inputObject.orderNotice}</td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-100">
                                        <td className="font-semibold text-gray-700 py-2 px-4">
                                            Phương thức thanh toán :
                                        </td>
                                        <td className="text-gray-600 py-2 px-4">{inputObject.paymentType}</td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-100">
                                        <td className="font-semibold text-gray-700 py-2 px-4">Địa chỉ nhận hàng :</td>
                                        <td className="text-gray-600 py-2 px-4">{inputObject.shippingAddress}</td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-100">
                                        <td className="font-semibold text-gray-700 py-2 px-4">Trạng thái đơn hàng :</td>
                                        <td>
                                            <select
                                                value={inputObject.statusOrder}
                                                onChange={(e) =>
                                                    setInputObject({
                                                        ...inputObject,
                                                        statusOrder: e.target.value,
                                                    })
                                                }
                                                className="p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            >
                                                {availableStatuses.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    {inputObject.statusOrder === "Chờ xác nhận hủy" && (
                                        <tr className="border-b hover:bg-gray-100">
                                            <td className="font-semibold text-gray-700 py-2 px-4">Lý do hủy:</td>
                                            <td className="text-gray-600 py-2 px-4">
                                                {inputObject.cancel_reason || "Không có lý do được cung cấp"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="border p-6 rounded-lg shadow-md bg-gray-50">
                            <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mb-4">
                                Sản phẩm trong đơn hàng
                            </h3>
                            {inputObject.products.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border border-gray-300 text-sm md:text-base rounded-lg">
                                        <thead>
                                            <tr className="bg-blue-100 text-gray-800 border-b border-gray-300">
                                                <th className="text-left py-3 px-4 font-semibold">Ảnh sản phẩm</th>
                                                <th className="text-left py-3 px-4 font-semibold">Tên sản phẩm</th>
                                                <th className="text-left py-3 px-4 font-semibold">Biến thể</th>
                                                <th className="text-right py-3 px-4 font-semibold">Số lượng</th>
                                                <th className="text-right py-3 px-4 font-semibold">Giá</th>
                                                <th className="text-right py-3 px-4 font-semibold">Tổng cộng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inputObject.products.map((item, index) => (
                                                <tr
                                                    key={item.product_id}
                                                    className={`${
                                                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                                                    } border-b hover:bg-blue-50`}
                                                >
                                                    <td className="py-3 px-4">
                                                        {item.image_url ? (
                                                            <img
                                                                src={item.image_url}
                                                                alt={item.product_name}
                                                                className="w-16 h-16 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <span>Không có ảnh</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">{item.product_name}</td>
                                                    <td className="py-3 px-4">{item.variant_name || "Không có"}</td>
                                                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(item.variant_price)}{" "}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(item.total_item_price)}{" "}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>Không có sản phẩm nào trong đơn hàng.</p>
                            )}

                            {/* Tổng tiền cần thanh toán */}
                            <div className="mt-5 flex justify-between">
                                <span className="font-semibold text-lg">Tổng tiền cần thanh toán:</span>
                                <span className="font-semibold text-lg text-green-600">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(inputObject.totalPrice)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginLeft: 35 }}>
                        {inputObject.statusOrder === "Chờ xác nhận hủy" && (
                            <div className="flex gap-4 ">
                                <button
                                    onClick={() =>
                                        setInputObject((prev) => ({
                                            ...prev,
                                            statusOrder: "Đã hủy",
                                        }))
                                    }
                                    className="bg-red-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-red-700 transition"
                                >
                                    Xác nhận hủy
                                </button>
                                <button
                                    onClick={() =>
                                        setInputObject((prev) => ({
                                            ...prev,
                                            statusOrder: "Chờ xác nhận",
                                        }))
                                    }
                                    className="bg-gray-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-gray-700 transition"
                                >
                                    Từ chối hủy
                                </button>
                            </div>
                        )}
                        <div style={{ marginLeft: 1050 }}>
                            <button
                                onClick={handleUpdateOrderStatus}
                                className="bg-blue-600 text-white py-3 px-6 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-x-2 transition"
                            >
                                <AiOutlineSave className="text-lg" />
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditOrder;
