import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Xử lý thay đổi giá trị input
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Xử lý gửi yêu cầu quên mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(""); // Reset lỗi
    setSuccess(""); // Reset thông báo thành công

    try {
      // Gửi email yêu cầu quên mật khẩu
      const response = await axios.post(
        "http://localhost:8000/api/forgot-password",
        { email }
      );

      // Hiển thị thông báo thành công
      setSuccess("Mật khẩu mới dã được gửi về mail của bạn");
    } catch (err) {
      // Xử lý lỗi nếu có
      setError("Xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Quên mật khẩu
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Bạn đã có mật khẩu{" "}
              <a
                className="text-blue-600 decoration-2 hover:underline font-medium"
                href="/login"
              >
                Đăng nhập ở đây
              </a>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="email-error"
                  >
                    Vui lòng nhập lại email
                  </p>
                </div>
                {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
                {success && (
                  <p className="text-xs text-green-600 mt-2">{success}</p>
                )}
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Reset password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
