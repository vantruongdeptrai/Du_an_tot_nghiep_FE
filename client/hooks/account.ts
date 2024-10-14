import axios from "axios";
import { useState } from "react";

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Thêm trạng thái này

  const handleLogin = async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      let loginInfo = {};
      if (identifier.includes('@')) {
        loginInfo = { email: identifier, password };
      } else {
        loginInfo = { phone: identifier, password };
      }

      console.log("Login Info: ", loginInfo); // Log thông tin đăng nhập

      const response = await axios.post('http://localhost:8000/api/login', loginInfo);
      console.log("Đăng nhập thành công:", response.data);

      // Lưu token và đặt trạng thái đăng nhập thành công
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);  // Đăng nhập thành công
      return true; // Trả về true nếu đăng nhập thành công
    } catch (err: any) {
      // In ra thông tin lỗi
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "Đã xảy ra lỗi.");
      return false; // Trả về false nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error, isLoggedIn }; // Trả về isLoggedIn
};
export default useLogin;
