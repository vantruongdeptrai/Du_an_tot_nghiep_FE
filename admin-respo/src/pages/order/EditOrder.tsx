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
    cancel_reason: "", // Thêm trường lý do hủy
  });

  const [loading, setLoading] = useState(true);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]); // Đảm bảo rằng kiểu là mảng string

  // Gọi API để lấy thông tin đơn hàng
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orders/${id}`);
        const data = await response.json();

        // Gọi API để lấy thông tin biến thể
        const variantResponse = await fetch(
          `http://localhost:8000/api/product-variants`
        );
        const variants = await variantResponse.json();

        // Gọi API để lấy thông tin màu sắc và kích thước
        const colorResponse = await fetch(`http://localhost:8000/api/colors`);
        const colors = await colorResponse.json();

        const sizeResponse = await fetch(`http://localhost:8000/api/sizes`);
        const sizes = await sizeResponse.json();

        // Kết hợp dữ liệu để hiển thị
        const updatedProducts = data.order.order_items.map((item: any) => {
          const variant = variants.find(
            (v) => v.id === item.product_variant_id
          );

          const color = colors.find((c: any) => c.id === variant?.color_id);
          const size = sizes.find((s: any) => s.id === variant?.size_id);

          return {
            ...item,
            variant_name: `${color?.name || "Không có màu"} - ${
              size?.name || "Không có size"
            }`,
            variant_price: parseFloat(variant?.final_price) || 0, // Lấy giá cuối cùng của biến thể
            total_item_price:
              (parseFloat(variant?.final_price) || 0) * item.quantity, // Tính tổng giá của sản phẩm theo biến thể
          };
        });

        setInputObject({
          customerName: data.order.user_name,
          phoneNumber: data.order.phone_order,
          emailAddress: data.order.email_order,
          orderNotice: data.order.user_note,
          products: updatedProducts,
          totalPrice: parseFloat(data.order.total_price),
          statusOrder: data.order.status_order,
          paymentType: data.order.payment_type,
          shippingAddress: data.order.shipping_address,
          cancel_reason: data.order.cancel_reason || "", // Lấy lý do hủy
        });

        // Cập nhật các trạng thái có thể chọn
        updateAvailableStatuses(data.order.status_order);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Hàm để cập nhật các trạng thái có thể chọn
  const updateAvailableStatuses = (status: string) => {
    // Đảm bảo tham số là kiểu string
    switch (status) {
      case "Chờ xác nhận":
        setAvailableStatuses(["Chờ xác nhận ", "Đã xác nhận", "Đã hủy"]);
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

  if (loading) return <p>Đang tải...</p>;

  // Hàm để cập nhật trạng thái đơn hàng
  // Hàm để cập nhật trạng thái đơn hàng
  const updateOrderStatus = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status_order: inputObject.statusOrder,
          cancel_reason:
            inputObject.statusOrder === "Chờ xác nhận hủy"
              ? inputObject.cancel_reason
              : null, // Chỉ gửi lý do hủy khi cần
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInputObject((prevState) => ({
          ...prevState,
          statusOrder: data.order.new_status_order,
        }));
        alert(`Cập nhật trạng thái thành công: ${data.order.new_status_order}`);
      } else {
        throw new Error("Cập nhật thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
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
                      Tên khách hàng:
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.customerName}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Số điện thoại :
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.phoneNumber}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Địa chỉ email:
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.emailAddress}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Ghi chú :
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.orderNotice}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Phương thức thanh toán :
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.paymentType}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Địa chỉ nhận hàng :
                    </td>
                    <td className="text-gray-600 py-2 px-4">
                      {inputObject.shippingAddress}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="font-semibold text-gray-700 py-2 px-4">
                      Trạng thái đơn hàng :
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
                      <td className="font-semibold text-gray-700 py-2 px-4">
                        Lý do hủy:
                      </td>
                      <td className="text-gray-600 py-2 px-4">
                        {inputObject.cancel_reason ||
                          "Không có lý do được cung cấp"}
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
                        <th className="text-left py-3 px-4 font-semibold">
                          Tên sản phẩm
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Biến thể
                        </th>
                        <th className="text-right py-3 px-4 font-semibold">
                          Số lượng
                        </th>
                        <th className="text-right py-3 px-4 font-semibold">
                          Giá
                        </th>
                        <th className="text-right py-3 px-4 font-semibold">
                          Tổng cộng
                        </th>
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
                          <td className="py-3 px-4">{item.product_name}</td>
                          <td className="py-3 px-4">
                            {item.variant_name || "Không có"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {item.quantity}
                          </td>
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
                <span className="font-semibold text-lg">
                  Tổng tiền cần thanh toán:
                </span>
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
    </div>
  );
};

export default EditOrder;
