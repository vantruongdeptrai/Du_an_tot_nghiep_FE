import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface ProductVariant {
    id: string;
    color_id: string;
    size_id: string;
    final_price: string;
    image_url: string;
}

interface Color {
    id: string;
    name: string;
}

interface Size {
    id: string;
    name: string;
}

interface OrderItem {
    product_variant_id: string;
    quantity: number;
    product_name: string;
    product_id: string;
}

interface UpdateOrderResponse {
    order: {
        new_status_order: string;
    };
}

const fetchOrderDetails = async (id: string) => {
    const response = await axios.get(`http://localhost:8000/api/orders/${id}`);
    const data = response.data;

    const variantResponse = await axios.get("http://localhost:8000/api/product-variants");
    const variants: ProductVariant[] = variantResponse.data;

    const colorResponse = await axios.get("http://localhost:8000/api/colors");
    const colors: Color[] = colorResponse.data;

    const sizeResponse = await axios.get("http://localhost:8000/api/sizes");
    const sizes: Size[] = sizeResponse.data;

    const updatedProducts = data.order.order_items.map((item: OrderItem) => {
        const variant = variants.find((v) => v.id === item.product_variant_id);
        const color = colors.find((c) => c.id === variant?.color_id);
        const size = sizes.find((s) => s.id === variant?.size_id);

        return {
            ...item,
            variant_name: `${color?.name || "Không có màu"} - ${size?.name || "Không có size"}`,
            variant_price: parseFloat(variant?.final_price || "0"),
            total_item_price: parseFloat(variant?.final_price || "0") * item.quantity,
            image_url: variant?.image_url || "",
        };
    });

    return {
        order: data.order,
        products: updatedProducts,
    };
};

const updateOrderStatus = async (id: string, statusOrder: string, cancelReason?: string) => {
    const response = await axios.put(
        `http://127.0.0.1:8000/api/orders/${id}`,
        {
            status_order: statusOrder,
            cancel_reason: cancelReason,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

export const useOrderAndUpdate = (id: string) => {
    const orderDetailsQuery = useQuery(["orderDetails", id], () => fetchOrderDetails(id), {
        enabled: !!id, // Chỉ gọi khi có id
    });

    const updateOrderStatusMutation = useMutation<
        UpdateOrderResponse,
        Error,
        { id: string; statusOrder: string; cancelReason?: string }
    >(({ id, statusOrder, cancelReason }) => updateOrderStatus(id, statusOrder, cancelReason));

    return {
        orderDetailsQuery,
        updateOrderStatusMutation,
    };
};
