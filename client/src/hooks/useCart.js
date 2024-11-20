import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";

const getAllCart = async (userId) => {
    try {
        const url = userId ? `/cart/auth?user_id=${userId}` : `/cart/guest`;
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        toast.error(`Error fetching cart: ${error.message}`);
        throw error;
    }
};

const useCart = (userId) => {
    const { data: carts, error, isLoading } = useQuery(
        ['cart', userId || 'guest'], // queryKey đảm bảo duy nhất
        () => getAllCart(userId),   // Gọi hàm fetch tương ứng
        {
            enabled: true, // Luôn bật query
        }
    );

    return {
        carts,
        isLoading,
        error
    };
};

export default useCart;
