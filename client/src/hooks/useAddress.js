import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axiosConfig';
import { toast } from 'react-toastify';

// Lấy tất cả địa chỉ
const fetchAddresses = async () => {
  try {
    const response = await apiClient.get('/addresses');
    return response.data.data;
  } catch (error) {
    console.error(error);
    toast.error('Get address failed!');
    throw error; // Ném lại lỗi để React Query xử lý
  }
};

// Thêm một địa chỉ mới
const createAddressApi = async (data) => {
  try {
    const response = await apiClient.post('/addresses', data);
    return response.data; // Trả về dữ liệu sau khi tạo thành công
  } catch (error) {
    console.error(error);
    toast.error('Create address failed!');
    throw error; // Ném lại lỗi để React Query xử lý
  }
};

const useAddress = () => {
  const queryClient = useQueryClient();

  // Sử dụng useQuery để lấy dữ liệu địa chỉ
  const { data: addresses = [], isLoading, isError, error } = useQuery(['addresses'], fetchAddresses);

  // Sử dụng useMutation để thêm địa chỉ mới
  const mutation = useMutation(createAddressApi, {
    onSuccess: () => {
      // Khi thêm địa chỉ thành công, chúng ta sẽ refetch lại danh sách địa chỉ
      queryClient.invalidateQueries('addresses');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Create address failed!');
    },
  });

  return {
    addresses,
    isLoading,
    isError,
    error,
    createAddress: mutation.mutate, // Hàm gọi để thêm địa chỉ mới
  };
};

export default useAddress;
