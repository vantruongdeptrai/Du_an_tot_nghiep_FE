import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Category, categoryInput } from "../api/categories/types";
import { useParams } from "react-router-dom";

const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorie, setCategorie] = useState<Category>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const respon = await axios.get("http://localhost:8000/api/categories");
            setCategories(respon.data.categories); 
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm lấy danh mục theo ID
    const getCategoryById = async (id: string | undefined) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8000/api/categories/${id}`);
            setCategorie(response.data);
        } catch (error) {
            setError("Category not found");
            console.error("Error fetching category by ID:", error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm tạo danh mục với ảnh
    const createCategory = async (data: categoryInput, file?: File) => {
        const formData = new FormData();

        // Append thông tin danh mục vào FormData
        formData.append("name", data.name);

        // Nếu có file ảnh thì thêm vào FormData
        if (file) {
            formData.append("image", file);
        }
        

        try {
            setIsLoading(true);
            await axios.post("http://localhost:8000/api/categories", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Category added successfully");
        } catch (err) {
            setError("Failed to create category");
        } finally {
            setIsLoading(false);
        }
    };


    const updateCategory = async (data: categoryInput, file?: File) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append('_method', 'put');
        console.log(id);

        if (file) {
            formData.append("image", file);
        }
        
        try {
            await axios.post("http://localhost:8000/api/categories/" + id, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Category edit successfully");
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };


    const deleteCategory = async (id: string) => {
        try {
            if (window.confirm("Are you sure you want to delete")) {
                setIsLoading(true);
                await axios.delete("http://localhost:8000/api/categories/" + id);
                toast.success("Category delete successfully");
                fetchCategories();
            }
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    useEffect(() => {
        if (!id) return;
        getCategoryById(id);
    }, [id]);

    return {
        categorie,
        categories,
        fetchCategories,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
        error,
        isLoading,
    };
};

export default useCategory;
