
import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const useProduct = () => {
    // const [products, setProducts] = useState([]);
    const getAllProducts = async () => {
        const response = await apiClient.get("/products");
        // setProducts(response.data);
        return response.data;
    };

    const {
        data: products,
        isLoading,
        isError,
    } = useQuery(["products"], getAllProducts, {
        onError: (error) => {
            toast.error(`Failed to fetch products: ${error.message}`);
        },
    });

    if (isLoading) {
        return { products: [], isLoading, isError };
    }

    if (isError) {
        return { products: [], isLoading, isError };
    }

    // useEffect(() => {
    //     getAllProducts();
    // }, [])

    return {
        products,
    };
};

export default useProduct;
