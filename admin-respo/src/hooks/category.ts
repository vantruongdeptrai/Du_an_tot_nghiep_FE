import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Category, categoryInput } from "../api/categories/types";

type InputError = {
    message: string;
};

const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const respon = await axios.get("http://localhost:8000/api/categories");
            setCategories(respon.data);
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };
    // Hàm tạo danh mục với ảnh
    const createCategory = async (data: categoryInput, file?: File) => {
        const formData = new FormData();

        // Append thông tin danh mục vào FormData
        formData.append("name", data.name);
        formData.append("slug", data.slug);

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


    
    const updateCategory = async (id: string, data: categoryInput, file?: File) => {
      const formData = new FormData();
      
      // Ensure name and slug are not null or undefined
      if (!data.name) {
        throw new Error("Name and slug are required fields.");
      }
    
      formData.append('name', data.name);

    
      if (file) {
        formData.append('image', file);
      }
    
      try {
        const response = await axios.put(`http://localhost:8000/api/categories/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        console.log('Cập nhật danh mục thành công:', response.data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMsg = error.response?.data?.message || error.message;
          console.error('Lỗi khi cập nhật danh mục:', errorMsg);
        } else {
          console.error('Lỗi không mong muốn:', error);
        }
        throw error;
      }
    };
      
    


    const deleteCategory = async (id: string) => {
        try {
            setIsLoading(true);
            await axios.delete(`http://localhost:8000/api/categories/${id}`);
            setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
        } catch (err) {
            console.error("Error deleting category:", err);
            setError((err as InputError)?.message || "Failed to delete category");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        error,
        isLoading,
    };
};

export default useCategory;
