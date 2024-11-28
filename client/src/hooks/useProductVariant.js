
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";

const useProductVariant = () => {
    const getAllProductVariants = async () => {
        const response = await apiClient.get("/product-variants");
        return response.data;
    };
    const {data: productVariants = []} = useQuery(
        ["productVariants"],
        getAllProductVariants,
    )
    return {
        productVariants,
    };
};

export default useProductVariant;
