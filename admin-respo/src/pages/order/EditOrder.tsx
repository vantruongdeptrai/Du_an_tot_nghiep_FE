import { AiOutlineSave } from "react-icons/ai";
import { Sidebar } from "../../components";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditOrder = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL
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
  });

  const [loading, setLoading] = useState(true);

  // Gọi API để lấy thông tin đơn hàng
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orders/${id}`);
        const data = await response.json();
        setInputObject({
          customerName: data.order.user_name,
          phoneNumber: data.order.phone_order,
          emailAddress: data.order.email_order,
          orderNotice: data.order.user_note,
          products: data.order.products,
          totalPrice: data.order.total_price,
          statusOrder: data.order.status_order,
          paymentType: data.order.payment_type,
          shippingAddress: data.order.shipping_address,
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;

  // Hàm để cập nhật trạng thái đơn hàng
  const updateOrderStatus = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status_order: inputObject.statusOrder, // Gửi status từ form vào
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Cập nhật trạng thái thành công: ${data.order.new_status_order}`);
      } else {
        throw new Error("Cập nhật thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
              Edit order #{id}
            </h2>
          </div>

          {/* Form và các trường thông tin */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="border p-6 rounded-lg shadow-md bg-gray-50">
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mb-4">
                Thông tin đơn hàng
              </h3>

              <table className="w-full table-auto border-collapse text-sm md:text-base">
                <tbody>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Customer name:
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.customerName}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Phone number:
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.phoneNumber}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Email address:
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.emailAddress}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Order notice:
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.orderNotice}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Payment type:
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.paymentType}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Shipping address:
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.shippingAddress}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Order status:
                    </td>
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
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                        <option value="Đang vận chuyển">Đang giao</option>
                        <option value="Giao hàng thành công">
                          Giao hàng thành công
                        </option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sản phẩm trong đơn hàng */}
            <div className="border p-6 rounded-lg shadow-md bg-gray-50">
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mb-4">
                Đơn hàng
              </h3>
              {/* <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inputObject.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-full border mb-2"
                    />
                    <h4 className="text-sm font-semibold text-gray-800">
                      {product.name}
                    </h4>
                    <p className="text-gray-500">
                      Số lượng: {product.quantity}
                    </p>
                  </div>
                ))}
              </div> */}

              <div className="mt-5">
                <div className="flex justify-between">
                  <span className="font-semibold">Tổng tiền:</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(inputObject.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nút lưu */}
          <div className="flex justify-end mt-6">
            <button
              onClick={updateOrderStatus}
              className="bg-blue-600 text-white py-3 px-6 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-x-2 transition"
            >
              <AiOutlineSave className="text-lg" />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
