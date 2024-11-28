import axios from "axios";

// Tạo instance Axios
const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api", // Thay bằng cổng chính xác
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

// Thêm interceptor để thêm token vào header cho mỗi request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
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
