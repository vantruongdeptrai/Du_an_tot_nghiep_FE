import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";

const getAllCategories = async () => {
    try {
        const response = await apiClient.get("/categories");
        return response.data.categories;
    } catch (error) {
        toast.error("Error:", error);
        throw error; // Đảm bảo lỗi được ném ra cho React Query xử lý
    }
};

const useCategory = () => {
    const { data: categories = [], error, isLoading } = useQuery(
        ['categories'], // queryKey, phải duy nhất
        getAllCategories
    );

    return {
        categories,
        isLoading,
        error
    };
};

export default useCategory;
