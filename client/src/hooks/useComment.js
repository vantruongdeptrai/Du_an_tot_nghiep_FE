import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

// Lấy tất cả bình luận

// Tạo bình luận mới

const useComment = () => {
    const { id } = useParams();
    const getAllComments = async () => {
        try {
            const response = await apiClient.get(`/products/${id}/comments`);
            return response.data;
        } catch (error) {
            toast.error("Error:", error);
            throw error; // Đảm bảo lỗi được ném ra cho React Query xử lý
        }
    };
    const createComment = async (data) => {
        try {
            const response = await apiClient.post(`/products/${id}/comments`, data);
            return response.data;
        } catch (error) {
            toast.error("Error:", error);
            throw error; // Đảm bảo lỗi được ném ra cho React Query xử lý
        }
    };
    const queryClient = useQueryClient();
    const {
        data: comments,
        error,
        isLoading,
    } = useQuery(["comments", id], getAllComments, {
        enabled: !!id, // Chỉ gọi API khi id có giá trị hợp lệ
    });

    // Hàm tạo bình luận mới
    const { mutate: createComments } = useMutation(createComment, {
        // On success, invalidate the "comments" query to refetch
        onSuccess: (newComment) => {
            // Cập nhật dữ liệu bình luận ngay lập tức
            queryClient.setQueryData(["comments"], (oldComments) => [
                ...oldComments,
                newComment, // Thêm bình luận mới vào danh sách
            ]);
        },
        onError: () => {
            toast.error("Failed to add comment");
        },
    });

    return {
        comments,
        createComments,
        error,
        isLoading,
    };
};

export default useComment;
