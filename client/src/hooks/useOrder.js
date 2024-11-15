import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";

const useOrder = () => {
    const createOrder = async (data, id, orderItems) => {
        try {
            const isLoggedIn = Boolean(localStorage.getItem("userInfo"));
            
            const endPoint = isLoggedIn ? "/oder/login" : "/oder/no-login";
            
            // Tạo dữ liệu order
            const orderData = {
                user_id: id,
                ...data,
                order_items: orderItems.map((item) => {
                    // Kiểm tra nếu sản phẩm có product_variant
                    if (item.product_variant_id) {
                        return {
                            product_variant_id: item.product_variant_id,
                            quantity: item.quantity,
                        };
                    } else {
                        return {
                            product_id: item.product_id,
                            quantity: item.quantity,
                        };
                    }
                }),
            };

            // Gửi yêu cầu POST với session_id trong header
            const response = await apiClient.post(endPoint, orderData);

            toast.success("Buy products successfully");
            console.log(response.data);
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    return {
        createOrder,
    };
};

export default useOrder;
