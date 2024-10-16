// components/SignInScreen.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container } from "../../styles/styles";
import useLogin from "./../../../hooks/account";
import { BaseButtonBlack } from "../../styles/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 

const SignInScreenWrapper = styled.section`
  /* Thêm các style tùy chỉnh tại đây */
`;

const SignInScreen = () => {
  const { handleLogin, loading, error } = useLogin();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Kiểm tra nếu đã đăng nhập trước đó thì chuyển hướng
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      navigate("/account"); // Chuyển hướng nếu đã có thông tin người dùng
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = await handleLogin(identifier, password);

    if (userData) {
      toast.success("Đăng nhập thành công!"); 

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("userInfo", JSON.stringify(userData));

      setTimeout(() => {
        navigate("/account"); // Chuyển đến trang tài khoản hoặc trang khác
      }, 500);
    } else if (error) {
      toast.error(error); 
    }
  };

  return (
    <SignInScreenWrapper>
      <Container>
        <h3>Đăng Nhập</h3>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier">Tên người dùng hoặc địa chỉ email</label>
            <input
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <BaseButtonBlack type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </BaseButtonBlack>
        </form>
        <p>
          Bạn chưa có tài khoản? <a href="/sign_up">Đăng ký</a>
        </p>
      </Container>
    </SignInScreenWrapper>
  );
};

export default SignInScreen;
