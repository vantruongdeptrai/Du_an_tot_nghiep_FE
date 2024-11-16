import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useOrder = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const getAllOrders = async () => {
        try {
            const response = await apiClient.get("/orders");
            setOrders(response.data);
            return response.data
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

            const response = await apiClient.post(endPoint, orderData);

            if (paymentMethod == "VNPay") {
                const vnpayResponse = await apiClient.post("/payment", {
                    bank_code: 123456,
                    amount: response.data.total_price * 100,
                });
                return vnpayResponse;
            } else {
                toast.success("Order created successfully!");
            }
        } catch (error) {
            toast.error("Failed to create order. Please try again.");
        }
    };

    useEffect(() => {
        getAllOrders();
    }, [])

    return {
        orders,
        getAllOrders,
        createOrder,
    };
};

export default useOrder;
