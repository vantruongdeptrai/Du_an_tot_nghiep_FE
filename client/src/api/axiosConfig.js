import axios from 'axios';

// Tạo instance Axios
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Thay đổi thành URL API của bạn
  timeout: 10000, // Thời gian chờ cho các yêu cầu (mili giây)
});

// Thêm interceptor để thêm token vào header cho mỗi request
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc từ nguồn khác mà bạn lưu token)
    const token = localStorage.getItem('token');
    
    // Nếu token tồn tại, thêm vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi nếu có
    return Promise.reject(error);
  }
);

export default apiClient;
