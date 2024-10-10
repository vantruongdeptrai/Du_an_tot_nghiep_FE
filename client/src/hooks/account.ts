// src/services/account.ts

import axios from 'axios';
import { toast } from 'react-toastify';

// Định nghĩa interface cho thông tin đăng nhập
interface LoginInfo {
  email?: string;
  phone?: string;
  password: string;
}

// interface RegisterInput {
//   name: string;
//   email: string;
//   password: string;
//   password_confirmation: string;
// }

const useAuth = () => {
  const loginUser = async (loginInfo: LoginInfo) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: loginInfo.email,
        phone: loginInfo.phone,
        password: loginInfo.password
      });
      
      // Trả về dữ liệu phản hồi từ server nếu đăng nhập thành công
      return response.data;
    } catch (error) {
      // Xử lý lỗi nếu đăng nhập không thành công
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };
  
  
  const registerUser = async (data) => {
      try {
         const response = await axios.post('http://127.0.0.1:8000/api/register', data);
         toast.success("Register successfully!");
         console.log(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
  }
  return {loginUser, registerUser}
}


export default useAuth;
