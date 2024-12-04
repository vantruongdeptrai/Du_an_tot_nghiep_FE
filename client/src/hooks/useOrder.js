import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch function for all orders
const getAllOrders = async () => {
    const response = await apiClient.get("/orders");
    return response.data;
};

const useOrder = () => {
    // Fetch all orders with useQuery
    const { data: orders = [], isLoading, isError } = useQuery(["orders"], getAllOrders);

    const createOrder = async (data, id, orderItems, paymentMethod) => {
        try {
            const isLoggedIn = Boolean(localStorage.getItem("userInfo"));
            const endPoint = isLoggedIn ? "/oder/login" : "/oder/no-login";

            const couponNames = [...new Set(orderItems.map((item) => item.coupon_name))];
            const couponName = couponNames.length > 0 ? couponNames[0] : null;

            const orderData = {
                user_id: id,
                ...data,
                order_items: orderItems.map((item) => {
                    return item.product_variant_id
                        ? {
                              product_variant_id: item.product_variant_id,
                              quantity: item.quantity,
                          }
                        : { product_id: item.product_id, quantity: item.quantity };
                }),
                coupon_name: couponName,
            };

            if (paymentMethod === "VNPAY") {
                const vnpayResponse = await apiClient.post("/create-payment", {
                    user_id: id,
                    payment_type: "VNPAY",
                    shipping_address: orderData.shipping_address,
                    coupon_id: null,
                    phone_order: orderData.phone_order,
                    name_order: orderData.name_order,
                    email_order: orderData.email_order,
                    user_note: orderData.user_note,
                    coupon_name: couponName,
                    order_items: orderItems.map((item) => {
                        return item.product_variant_id
                            ? {
                                  product_variant_id: item.product_variant_id,
                                  quantity: item.quantity,
                              }
                            : { product_id: item.product_id, quantity: item.quantity };
                    }),
                });
                console.log(vnpayResponse);
                return vnpayResponse.data.payment_url;
            } else {
                const response = await apiClient.post(endPoint, orderData);
                toast.success("Thanh toán thành công.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error creating order.");
        }
    };

    // Hàm gửi email đơn hàng
    const sendInvoice = async (orderId, email) => {
        try {
            const response = await apiClient.post(
                `http://127.0.0.1:8000/api/order/${orderId}/send-invoice?email_order=${email}`
            );
            console.log("Invoice sent successfully", response.data);
            toast.success("Invoice has been sent successfully!");
            return response.data;
        } catch (error) {
            console.error("Error sending invoice", error);
            toast.error("Error sending invoice.");
            throw error;
        }
    };

    const queryClient = useQueryClient();

    const deleteOrderReason = async (id, data) => {
        try {
            await apiClient.post(`/orders/cancel/${id}`, data);
            queryClient.invalidateQueries(["orders"]); // Làm mới dữ liệu
        } catch (error) {
            toast.error("Error cancelling order.");
            console.log(error);
        }
    };

    const deleteOrder = async (id) => {
        try {
            if (window.confirm("Are you sure you want to delete this order?")) {
                await apiClient.delete(`/orders/${id}`);
                toast.success("Order deleted successfully!");
            }
        } catch (error) {
            toast.error("Error deleting order.");
            console.log(error);
        }
    };

    return {
        orders,
        createOrder,
        deleteOrderReason,
        deleteOrder,
        sendInvoice,
        isLoading,
        isError,
    };
};

export default useOrder;
