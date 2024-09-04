import axios from "axios";

const request = axios.create({
    baseURL: "http://localhost:8000/api", 
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor cho request
request.interceptors.request.use(
    function (config) {
      // Thêm token vào header nếu có
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      // Xử lý lỗi trước khi request được gửi đi
      return Promise.reject(error);
    }
  );
  
  // Thêm interceptor cho response
  request.interceptors.response.use(
    function (response) {
      // Xử lý dữ liệu response trước khi trả về
      return response.data;
    },
    function (error) {
      // Xử lý lỗi response
      if (error.response) {
        // Xử lý lỗi trả về từ server
        if (error.response.status === 401) {
          // Xử lý khi không có quyền truy cập (Unauthorized)
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          localStorage.removeItem('token');
          window.location.href = '/login'; // Chuyển hướng người dùng về trang đăng nhập
        } else if (error.response.status === 500) {
          // Xử lý lỗi server
          alert('Lỗi hệ thống. Vui lòng thử lại sau.');
        }
      } else if (error.request) {
        // Xử lý lỗi khi không nhận được phản hồi từ server
        alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
      } else {
        // Xử lý các lỗi khác
        alert('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
      return Promise.reject(error);
    }
  );

export default request;
