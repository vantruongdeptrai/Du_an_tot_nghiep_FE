import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../src/api/axiosConfig";
import { useState } from "react";

// Hàm fetch dữ liệu tìm kiếm
const fetchSearchResults = async (keyword) => {
    if (!keyword) return []; // Nếu không có keyword, trả về mảng rỗng
    try {
        const response = await apiClient.get(`/search?name=${keyword}`);
        return response.data.products.data; // Trả về danh sách sản phẩm
    } catch (err) {
        toast.error("Lỗi khi tải kết quả: " + err.message);
        throw err; // Ném lỗi để React Query xử lý
    }
};

const useSearch = () => {
    const [keyword, setKeyword] = useState("");

    // Sử dụng React Query để gọi API và nhận dữ liệu tìm kiếm
    const { data: results, isLoading, error } = useQuery(
        ["searchResults", keyword], // Key cho cache, bao gồm keyword
        () => fetchSearchResults(keyword), // Hàm fetch dữ liệu
        {
            enabled: !!keyword, // Chỉ gọi API khi keyword có giá trị
        }
    );

    return {
        keyword,
        setKeyword,
        results,
        isLoading,
        error,
    };
};

export default useSearch;
