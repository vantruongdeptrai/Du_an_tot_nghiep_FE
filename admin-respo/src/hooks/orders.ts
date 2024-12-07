import { useQuery } from "@tanstack/react-query";

// Định nghĩa kiểu đơn hàng
interface Order {
    id: string;
    user_id: string;
    total_price: string;
    status_order: string;
    payment_type: string;
    shipping_address: string;
    user_name?: string;
}

// Hàm fetch đơn hàng từ API
const fetchOrders = async (): Promise<Order[]> => {
    const response = await fetch("http://localhost:8000/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
};

const fetchOrderById = async (id: string): Promise<Order> => {
    const response = await fetch(`http://localhost:8000/api/orders/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch order with id: ${id}`);
    return response.json();
};

// Hàm fetch thông tin người dùng từ API
const fetchUserDetails = async (userId: string): Promise<string> => {
    try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        return data.name || "Unknown User";
    } catch (error) {
        console.error(`Error fetching user details for userId ${userId}:`, error);
        return "Unknown User";
    }
};

// Hook để lấy tất cả đơn hàng
const useFetchAllOrders = () => {
    return useQuery<Order[]>(["allOrders"], fetchOrders, {
        cacheTime: 30 * 60 * 1000, // Giữ dữ liệu trong cache 30 phút
        refetchOnWindowFocus: false, // Không tự động refetch khi focus lại vào window
    });
};

// Hook chính để lấy đơn hàng và thông tin người dùng
const useFetchOrdersWithUserDetails = () => {
    return useQuery<Order[]>(
        ["ordersWithUserDetails"],
        async () => {
            const orders = await fetchOrders(); // Lấy tất cả đơn hàng từ API

            // Bổ sung thông tin người dùng cho từng đơn hàng
            const ordersWithUsers = await Promise.all(
                orders.map(async (order) => {
                    const userName = await fetchUserDetails(order.user_id);
                    return { ...order, user_name: userName };
                })
            );

            return ordersWithUsers;
        },
        {
            cacheTime: 30 * 60 * 1000, // Giữ dữ liệu trong cache 30 phút
            refetchOnWindowFocus: false, // Không tự động refetch khi focus lại vào window
        }
    );
};

const useFetchOrderById = (id: string) => {
    return useQuery<Order>(["order", id], () => fetchOrderById(id), {
        cacheTime: 30 * 60 * 1000, // Giữ dữ liệu trong cache 30 phút
        refetchOnWindowFocus: false, // Không tự động refetch khi focus lại vào window
    });
};

export { useFetchOrdersWithUserDetails, useFetchAllOrders, useFetchOrderById };
