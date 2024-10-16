import axios from 'axios';

// Tạo instance Axios
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Thay đổi thành URL API của bạn
  timeout: 10000, // Thời gian chờ cho các yêu cầu (mili giây)
});

export default apiClient;
