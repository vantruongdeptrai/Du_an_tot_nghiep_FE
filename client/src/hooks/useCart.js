import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";

const getAllCart = async () => {
    try {
        const response = await apiClient.get("/cart");
        return response.data;
    } catch (error) {
        toast.error("Error:", error);
        throw error; // Đảm bảo lỗi được ném ra cho React Query xử lý
    }
};

const useCart = () => {
    const { data: carts, error, isLoading } = useQuery(
        ['carts'], // queryKey, phải duy nhất
        getAllCart
    );

    return {
        carts,
        isLoading,
        error
    };
};

export default useCart;
