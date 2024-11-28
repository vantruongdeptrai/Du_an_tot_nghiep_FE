import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const useOrder = () => {
    const [orders, setOrders] = useState([]);

    const getAllOrders = async () => {
        try {
            const response = await apiClient.get("/orders");
            setOrders(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };
    const createOrder = async (data, id, orderItems, paymentMethod) => {
        try {
            const isLoggedIn = Boolean(localStorage.getItem("userInfo"));
            const endPoint = isLoggedIn ? "/oder/login" : "/oder/no-login";
            // const total_prices = orderItems.reduce((acc, item) => {
            //     // Tính giá trị mỗi item sau khi áp dụng giảm giá
            //     const itemDiscount = item.discount || 0;
            //     const itemPrice = item.price * item.quantity;
            //     const priceAfterDiscount = itemPrice - itemDiscount;
            //     return acc + priceAfterDiscount; // Cộng dồn giá trị sau giảm giá vào tổng giá trị đơn hàng
            // }, 0);
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
            console.log(orderData);

            if (paymentMethod === "NCB") {
                const vnpayResponse = await apiClient.post("/create-payment", {
                    user_id: id,
                    payment_type: "NCB",
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

                return vnpayResponse;
            } else {
                const response = await apiClient.post(endPoint, orderData);
                console.log(response.data);
                
                toast.success("Order created successfully!");
            }
        } catch (error) {
            console.log(error);
            toast.error("error");
        }
    };
    const deleteOrderReason = async (id, data) => {
        try {
            await apiClient.post(`/orders/cancel/${id}`, data);
            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
        } catch (error) {
            toast.error("error");
            console.log(error);
        }
    };

    const deleteOrder = async (id) => {
        try {
            if (window.confirm("Are you sure you want to delete this order?")) {
                await apiClient.delete(`/orders/${id}`);
                setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
                toast.success("Order deleted successfully!");
                window.location.reload();
            }
        } catch (error) {
            toast.error("error");
            console.log(error);
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    return {
        orders,
        getAllOrders,
        createOrder,
        deleteOrderReason,
        deleteOrder,
    };
};

export default useOrder;
