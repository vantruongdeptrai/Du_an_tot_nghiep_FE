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

      const response = await axios.post('http://127.0.0.1:8000/api/login', loginInfo);
      console.log("Đăng nhập thành công:", response.data);

      // Lưu token và đặt trạng thái đăng nhập thành công
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);  // Đăng nhập thành công
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error, isLoggedIn }; // Trả về isLoggedIn
};
export default useLogin;
