import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const deleteCart = async (id) => {
    try {
        const response = await apiClient.delete(`/delete/${id}`);
        return response.data;
    } catch (error) {
        toast.error(`Error deleting item: ${error.response?.data?.message || error.message}`);
        throw error;
    }
};

const useCart = (userId) => {
    const queryClient = useQueryClient();
    const {
        data: carts = [],
        error,
        isLoading,
    } = useQuery(
        ["cart", userId || "guest"], // queryKey đảm bảo duy nhất
        () => getAllCart(userId), // Gọi hàm fetch tương ứng
        {
            enabled: true, // Luôn bật query
        }
    );
    const deleteItemMutation = useMutation(deleteCart, {
        onSuccess: () => {
            queryClient.invalidateQueries(["cart", userId || "guest"]);
            toast.success("Delete cart successfully.");
        },
        onError: (error) => {
            toast.error(`Failed to delete item: ${error.message}`);
        },
    });

    return {
        carts,
        isLoading,
        error,
        getAllCart,
        deleteItem: deleteItemMutation.mutate, // Hàm xóa item
        isDeleting: deleteItemMutation.isLoading,
    };
};

export default useCart;
