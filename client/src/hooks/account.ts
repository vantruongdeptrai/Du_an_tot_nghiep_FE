// src/services/account.ts

import axios from 'axios';

// Định nghĩa interface cho thông tin đăng nhập
interface LoginInfo {
  email?: string;
  phone?: string;
  password: string;
}

// Hàm xử lý đăng nhập người dùng
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

export default loginUser;
