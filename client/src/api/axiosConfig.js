import axios from 'axios';

// Tạo instance Axios
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Thay đổi thành URL API của bạn
  timeout: 10000, // Thời gian chờ cho các yêu cầu (mili giây)
});

// Thêm interceptor để thêm token vào header cho mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
