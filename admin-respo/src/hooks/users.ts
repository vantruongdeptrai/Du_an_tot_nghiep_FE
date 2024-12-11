import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "../api/user/types";

// Hàm fetch thông tin người dùng
const getAllUser = async () => {
    const response = await axios.get('http://localhost:8000/api/users'); // Đổi URL này theo API của bạn
    return response.data;
  };
  
  // Hook `useUser` sử dụng React Query
  const useUser = () => {
    const { data: users, error, isLoading } = useQuery<User[], Error>(['user'], getAllUser);
  
    return {
      users,
      isLoading,
      error,
    };
  };
  
  export default useUser;