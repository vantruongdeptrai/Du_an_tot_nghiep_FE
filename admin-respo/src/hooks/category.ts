import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Category, categoryInput } from "../api/categories/types";

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
  const createCategory = async (data: categoryInput) => {
    try {
        setIsLoading(true);
        await axios.post("http://localhost:8000/api/categories", data);
        toast.success("Category added successfully");
    } catch (err) {
        setError("Failed to fetch category");
    } finally {
        setIsLoading(false);
    }
  };

  const updateCategory = async (
    id: string,
    updatedCategory: Partial<Category>
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `http://localhost:8000/api/categories/${id}`,
        updatedCategory
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id ? response.data : category
        )
      );
    } catch (err: any) {
      console.error("Error updating category:", err);
      setError(err?.message || "Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:8000/api/categories/${id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (err: any) {
      console.error("Error deleting category:", err);
      setError(err?.message || "Failed to delete category");
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
