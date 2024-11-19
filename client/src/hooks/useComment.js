import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";

// Lấy tất cả bình luận
const getAllComments = async () => {
    try {
        const response = await apiClient.get("/comments");
        return response.data;
    } catch (error) {
        toast.error("Error:", error);
        throw error; // Đảm bảo lỗi được ném ra cho React Query xử lý
    }
};

// Tạo bình luận mới
const createComment = async (data) => {
    try {
        const response = await apiClient.post("/comments", data);
        return response.data;
    } catch (error) {
        toast.error("Error:", error);
        throw error; // Đảm bảo lỗi được ném ra cho React Query xử lý
    }
};

const useComment = () => {
    const queryClient = useQueryClient();
    const { data: comments, error, isLoading } = useQuery(["comments"], getAllComments);

    // Hàm tạo bình luận mới
    const {
        mutate: createComments,
    } = useMutation(createComment, {
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
