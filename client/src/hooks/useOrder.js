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
            };
            console.log(orderItems);
            

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
                toast.success("Order created successfully!");
            }
        } catch (error) {
            toast.error("error");
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    return {
        orders,
        getAllOrders,
        createOrder,
    };
};

export default useOrder;
