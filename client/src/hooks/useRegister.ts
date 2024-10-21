// src/services/account.ts

import axios from 'axios';
import { toast } from 'react-toastify';
import apiClient from '../api/axiosConfig';

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
  
  
  const registerUser = async (data) => {
      try {
         const response = await apiClient.post('/register', data);
         toast.success("Register successfully!");
         console.log(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
  }
  return {registerUser}
}


export default useAuth;
