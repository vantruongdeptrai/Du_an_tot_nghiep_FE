import { useState, useEffect } from "react";
import apiClient from "../api/axiosConfig";
import { toast } from 'react-toastify';

const useProduct = () => {
    const [products, setProducts] = useState([]);
    const getAllProducts = async () => {
        try {
            const response = await apiClient.get("/products");
            setProducts(response.data);
        } catch (error) {
            toast.error("Error:", error);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, [])

    return {
        products,
        getAllProducts,
    };
};

export default useProduct;
