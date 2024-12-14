import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Category, categoryInput } from "../api/categories/types";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchCategories = async () => {
    const response = await axios.get("http://localhost:8000/api/categories");
    return response.data.categories;
};
const useCategory = () => {
    const [categorie, setCategorie] = useState<Category>();
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { id } = useParams();
    const { data: categories, isLoading, isError } = useQuery<Category[]>(
        ["categories"],
        fetchCategories
    )
    // Hàm lấy danh mục theo ID
    const getCategoryById = async (id: string | undefined) => {
        try {
            
            const response = await axios.get(`http://localhost:8000/api/categories/${id}`);
            setCategorie(response.data);
        } catch (error) {
            toast.error("Lỗi lấy danh mục theo id!");
            console.error("Error fetching category by ID:", error);
            return null;
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
            
            await axios.post("http://localhost:8000/api/categories", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Thêm mới danh mục thành công.");
        } catch (err) {
            toast.error("Lỗi cập nhất danh mục");
            console.log(err);
            
        }
    };

    const updateCategory = async (data: categoryInput, file?: File) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("method", "put");
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
            toast.success("Cập nhật danh mục thành công.");
        } catch (error) {
            toast.error("Lỗi cập nhất danh mục");
            console.error(error);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            if (window.confirm("Bạn thực sự muốn xóa?")) {
                
                await axios.delete("http://localhost:8000/api/categories/" + id);
                toast.success("Xóa danh mục thành công.");
                queryClient.invalidateQueries(["categories"]);
            }
        } catch (err) {
            setError("Failed to fetch permissions");
        }
    };
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
        isError
    };
};

export default useCategory;
