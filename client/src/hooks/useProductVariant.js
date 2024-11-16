import { useState, useEffect } from "react";
import apiClient from "../api/axiosConfig";
import { toast } from 'react-toastify';

const useProductVariant = () => {
    const [productVariants, setproductVariants] = useState([]);
    const getAllProductVariants = async () => {
        try {
            const response = await apiClient.get("/product-variants");
            setproductVariants(response.data);
            return response.data;
        } catch (error) {
            toast.error("Error:", error);
        }
    };

    useEffect(() => {
        getAllProductVariants();
    }, [])

    return {
        productVariants,
        getAllProductVariants,
    };
};

export default useProductVariant;
