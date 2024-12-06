import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";

// Lấy tất cả địa chỉ
const fetchAddresses = async () => {
    try {
        const response = await apiClient.get("/addresses");
        return response.data.data;
    } catch (error) {
        console.error(error);
        toast.error("Get address failed!");
        throw error; // Ném lại lỗi để React Query xử lý
    }
};

// Thêm một địa chỉ mới
const createAddressApi = async (data) => {
    try {
        const response = await apiClient.post("/addresses", data);
        return response.data; // Trả về dữ liệu sau khi tạo thành công
    } catch (error) {
        console.error(error);
        toast.error("Tạo địa chỉ không thành công!");
        throw error; // Ném lại lỗi để React Query xử lý
    }
};

const updateAddressApi = async (data) => {
    try {
        const response = await apiClient.put(`/addresses/${data.id}`, data);
        return response.data; // Trả về dữ liệu sau khi tạo thành công
    } catch (error) {
        console.error(error);
        toast.error("Sửa địa chỉ không thành công!");
        throw error; // Ném lại lỗi để React Query xử lý
    }
};

const updateDefaultAddressApi = async (address, is_default = 1) => {
    try {
        const response = await apiClient.put(`/addresses/${address.id}`, { ...address, is_default: is_default });
        console.log(response);

        return response.data; // Trả về dữ liệu sau khi cập nhật thành công
    } catch (error) {
        console.error(error);
        toast.error("Cập nhật địa chỉ mặc định không thành công!");
        throw error; // Ném lại lỗi để React Query xử lý
    }
};

const deleteAddressApi = async (id) => {
    try {
        const response = await apiClient.delete(`/addresses/${id}`);
        return response.data; // Trả về dữ liệu sau khi xóa thành công
    } catch (error) {
        console.error(error);
        toast.error("Xóa địa chỉ không thành công!");
        throw error; // Ném lại lỗi để React Query xử lý
    }
};

const useAddress = () => {
    const queryClient = useQueryClient();

    // Sử dụng useQuery để lấy dữ liệu địa chỉ
    const { data: addresses = [], isLoading, isError, error } = useQuery(["addresses"], fetchAddresses);

    // Sử dụng useMutation để thêm địa chỉ mới
    const mutation = useMutation(createAddressApi, {
        onSuccess: () => {
            // Khi thêm địa chỉ thành công, chúng ta sẽ refetch lại danh sách địa chỉ
            queryClient.invalidateQueries("addresses");
        },
        onError: (error) => {
            console.log(error);
            toast.error("Create address failed!");
        },
    });
    // Mutation cho việc cập nhật địa chỉ
    const updateMutation = useMutation(updateAddressApi, {
        onSuccess: () => {
            queryClient.invalidateQueries("addresses");
            toast.success("Cập nhật địa chỉ thành công!");
        },
        onError: () => {
            toast.error("Sửa địa chỉ không thành công!");
        },
    });

    const updateDefaultMutation = useMutation(updateDefaultAddressApi, {
        onSuccess: () => {
            // Sau khi cập nhật địa chỉ mặc định thành công, làm mới danh sách địa chỉ
            queryClient.invalidateQueries("addresses");
            toast.success("Cập nhật địa chỉ mặc định thành công!");
        },
        onError: () => {
            toast.error("Cập nhật địa chỉ mặc định không thành công!");
        },
    });
    const deleteMutation = useMutation(deleteAddressApi, {
        onSuccess: () => {
            queryClient.invalidateQueries("addresses");
            toast.success("Xóa địa chỉ thành công!");
        },
        onError: () => {
            toast.error("Xóa địa chỉ không thành công!");
        },
    });

    return {
        addresses,
        isLoading,
        isError,
        error,
        createAddress: mutation.mutate, // Hàm gọi để thêm địa chỉ mới
        updateAddress: updateMutation.mutate,
        updateDefaultAddressApi: updateDefaultMutation.mutate,
        deleteAddress: deleteMutation.mutate,
    };
};

export default useAddress;
