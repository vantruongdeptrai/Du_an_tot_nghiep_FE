import { useState, useEffect } from "react";
import apiClient from "../api/axiosConfig";
import { toast } from 'react-toastify';

const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const getAllCategories = async () => {
        try {
            const response = await apiClient.get("/categories");
            setCategories(response.data.categories);
            return response.data.categories;
        } catch (error) {
            toast.error("Error:", error);
        }

    };

    useEffect(() => {
        getAllCategories();
    }, [])

    return {
        categories,
        getAllCategories,
    };
};

export default useCategory;
