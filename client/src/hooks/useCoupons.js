import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";

const getAllCoupons = async () => {
    try {
        const response = await apiClient.get("/coupons");
        return response.data;
    } catch (error) {
        toast.error("Error:", error);
        throw error; // Đảm bảo lỗi được ném ra cho React Query xử lý
    }
};

const useCoupon = () => {
    const { data: coupons, error, isLoading } = useQuery(
        ['coupons'], // queryKey, phải duy nhất
        getAllCoupons
    );

    return {
        coupons,
        isLoading,
        error
    };
};

export default useCoupon;
