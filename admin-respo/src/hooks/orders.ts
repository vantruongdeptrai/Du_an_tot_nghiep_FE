import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Định nghĩa kiểu đơn hàng
interface Order {
    id: string;
    user_id: string;
    total_price: string;
    status_order: string;
    payment_type: string;
    shipping_address: string;
    name_order?: string;
}

// Hàm fetch đơn hàng từ API
const fetchOrders = async (): Promise<Order[]> => {
    const response = await axios.get("http://localhost:8000/api/orders");
    return response.data;
};

// Hook để lấy tất cả đơn hàng
const useFetchOrders = () => {
    const {data: orders, isLoading} = useQuery(
        ["orders"],
        fetchOrders
    );
    return {
        orders,
        isLoading
    }
};

export default useFetchOrders;
