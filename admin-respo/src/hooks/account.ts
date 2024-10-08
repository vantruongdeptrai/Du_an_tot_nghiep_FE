// src/hooks/account.ts
import { useState } from "react";
import axios from "axios"; // Thực hiện API call trực tiếp ở đây

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

      // Gọi API trực tiếp ở đây
      const response = await axios.post('http://127.0.0.1:8000/api/login', loginInfo);
      console.log("Đăng nhập thành công:", response.data);
      // Thực hiện các bước tiếp theo nếu đăng nhập thành công
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};

export default useLogin;
