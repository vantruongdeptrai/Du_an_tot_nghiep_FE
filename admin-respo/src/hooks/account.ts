import axios from "axios";
import { useState } from "react";

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);  

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

      const userData = response.data.user;

      
      if (userData.role_id === 1) { 
        localStorage.setItem("token", response.data.token); 
        localStorage.setItem("user", JSON.stringify(userData)); 
        setIsLoggedIn(true); 
        setUser(userData);  
      } else {
       
        setError("Bạn không có quyền truy cập. Chỉ admin mới có thể đăng nhập.");
      }
    } catch (err: any) {
      
      setError(err.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error, isLoggedIn, user };
};

export default useLogin;
