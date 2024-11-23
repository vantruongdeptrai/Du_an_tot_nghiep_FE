import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "./../hooks/account";

const Login: React.FC = () => {
  const { handleLogin, loading, error, isLoggedIn, user } = useLogin();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      errors.identifier = "Vui lòng nhập email hoặc số điện thoại.";
    }
    if (!password.trim()) {
      errors.password = "Vui lòng nhập mật khẩu.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleLogin(identifier, password);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.role_id === 1) {
      navigate("/profile");
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="bg-gray-100 shadow-lg rounded-2xl p-10 max-w-md w-full transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Đăng nhập Admin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email hoặc Số điện thoại"
              className={`w-full p-4 bg-white border ${
                formErrors.identifier ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 text-gray-900 placeholder-gray-400`}
            />
            {formErrors.identifier && (
              <p className="mt-2 text-sm text-red-500">
                {formErrors.identifier}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className={`w-full p-4 bg-white border ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 text-gray-900 placeholder-gray-400`}
            />
            {formErrors.password && (
              <p className="mt-2 text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold text-white rounded-lg shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition duration-300`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-center text-sm text-red-500 animate-pulse">
            {error}
          </p>
        )}
        {isLoggedIn && user?.role_id === 1 && (
          <p className="mt-4 text-center text-sm text-green-500">
            Đăng nhập thành công! Đang chuyển hướng...
          </p>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          Quên mật khẩu?{" "}
          <a
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Nhấn vào đây
          </a>
        </p>
        {/* Nút chuyển sang trang đăng ký
        <p className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Đăng ký ngay
          </button>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
