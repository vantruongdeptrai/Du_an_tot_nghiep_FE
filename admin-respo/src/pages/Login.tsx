import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "./../hooks/account";

const Login: React.FC = () => {
  const { handleLogin, loading, error, isLoggedIn, user } = useLogin();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(identifier, password);
  };

  useEffect(() => {
    if (isLoggedIn && user?.role_id === 1) {
      navigate("/profile");
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <div className="login-container">
      <h2>Đăng nhập Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email hoặc Số điện thoại"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>} {}
      {isLoggedIn && user?.role_id === 1 && (
        <p>Đăng nhập thành công! Đang chuyển hướng...</p>
      )}
    </div>
  );
};

export default Login;
