import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";

// Hàm lấy thông tin người dùng
const fetchUser = async () => {
    const response = await apiClient.get("/users");
    return response.data; // Trả về dữ liệu người dùng từ API
};

const getAllUser = async () => {
    const token = localStorage.getItem("token");
    const response = await apiClient.get("/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data; // Trả về dữ liệu người dùng từ API
};

// Hàm cập nhật thông tin người dùng bao gồm ảnh
const updateUser = async (userData) => {
    const {id} = userData;
    // const { id, name, email, phone, image } = userData; // Thay profileImage bằng image
    // const formData = new FormData();

    // // Thêm dữ liệu vào formData
    // formData.append("name", name);
    // formData.append("email", email);
    // formData.append("phone", phone);

    // // Kiểm tra nếu có ảnh, thêm vào formData
    // if (image) {
    //     formData.append("image", image); // Phải khớp với key API yêu cầu
    // }

    // Gửi yêu cầu PUT
    const response = await apiClient.put(`/users/${id}`, userData)

    return response.data; // Axios trả về dữ liệu đã parse sẵn
};


// Custom hook để lấy và cập nhật thông tin người dùng
const useUser = () => {
    // Sử dụng useQuery để lấy thông tin người dùng
    // const queryClient = useQueryClient();
    const { data: users = [], error, isLoading } = useQuery(["users"], fetchUser);
    const { data: user = []} = useQuery(["user"], getAllUser);
    // const { data: users = []} = useQuery(["user"], getAllUser);

    // Sử dụng useMutation để cập nhật thông tin người dùng
    // const {
    //     mutate: updateUserMutation,
    //     isLoading: isUpdating,
    //     error: updateError,
    // } = useMutation(updateUser, {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(["user"]);
    //         // Có thể thực hiện các hành động bổ sung như cập nhật lại thông tin người dùng trong localStorage hoặc trigger thêm hành động nào đó
    //     },
    //     onError: (error) => {
    //         console.error("Error updating user:", error);
    //     },
    // });

    return {
        user,
        users, // Thông tin người dùng
        error, // Lỗi khi lấy thông tin người dùng
        isLoading, // Trạng thái đang tải thông tin người dùng
        updateUser // Hàm cập nhật người dùng
        // isUpdating, // Trạng thái đang cập nhật người dùng
        // updateError, // Lỗi khi cập nhật thông tin người dùng
    };
};

export default useUser;
