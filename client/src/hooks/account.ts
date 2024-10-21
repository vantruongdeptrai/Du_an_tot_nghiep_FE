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
  
      console.log("Login Info: ", loginInfo); 
  
      const response = await axios.post('http://localhost:8000/api/login', loginInfo);
      console.log("Đăng nhập thành công:", response.data);
  
     
      localStorage.setItem("token", response.data.token);
  
      
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
  
      setIsLoggedIn(true);  
      return true;
    } catch (err: any) {
      
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "Đã xảy ra lỗi.");
      return false; 
    } finally {
      setLoading(false);
    }
  };
  return { handleLogin, loading, error, isLoggedIn }; 
};
export default useLogin;