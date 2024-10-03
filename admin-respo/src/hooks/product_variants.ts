import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ProductVariant } from "../api/products/types";

const useProductVariant = () => {
    // const [product_varients, setProduct_varients] = useState<ProductVariant[]>([]);
    // const [product_varient, setProduct_varient] = useState<ProductVariant>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const getproduct_varients = async () => {
    //     try {
    //         setIsLoading(true);
    //         const respon = await axios.get("http://localhost:8000/api/product-varients");
    //         setProduct_varients(respon.data);
    //     } catch (err) {
    //         setError("Failed to fetch permissions");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // Hàm lấy danh mục theo ID
    // const getProductById = async (id: string | undefined) => {
    //     try {
    //         setIsLoading(true);
    //         const response = await axios.get(`http://localhost:8000/api/product-varients/${id}`);
    //         setProduct(response.data);
    //     } catch (error) {
    //         setError("Product not found");
    //         console.error("Error fetching Product by ID:", error);
    //         return null;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // Hàm tạo danh mục với ảnh
    const createProductVariant = async (data: ProductVariant) => {

        try {
            setIsLoading(true);
            const response = await axios.post("http://localhost:8000/api/product-variants", data);
            toast.success("Product Variant added successfully");
            const productData = response.data;
            return productData;
        } catch (err) {
            setError("Failed to create Product");
        } finally {
            setIsLoading(false);
        }
    };
    // api/productApi.ts

  const getProductVariantById = async (product_id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/product-variants/${product_id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching product variant with ID ${product_id}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch product variant:', error);
      throw error;
    }
  };
  

    // const updateProduct = async (data: ProductVariant, file?: File) => {
    //     const formData = new FormData();
    //     formData.append("name", data.name);
    //     formData.append("_method", "put");
    //     console.log(id);

    //     if (file) {
    //         formData.append("image", file);
    //     }

    //     try {
    //         await axios.post("http://localhost:8000/api/product-varients/" + id, formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             },
    //         });
    //         toast.success("Product edit successfully");
    //     } catch (error) {
    //         console.error("Error updating Product:", error);
    //     }
    // };

    // const deleteProduct = async (id: string) => {
    //     try {
    //         if (window.confirm("Are you sure you want to delete")) {
    //             setIsLoading(true);
    //             await axios.delete("http://localhost:8000/api/product-varients/" + id);
    //             toast.success("Product delete successfully");
    //             getproduct_varients();
    //         }
    //     } catch (err) {
    //         setError("Failed to fetch permissions");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     getproduct_varients();
    // }, []);
    // useEffect(() => {
    //     if (!id) return;
    //     getProductById(id);
    // }, [id]);

    return {
        getProductVariantById,
        // product_varient,
        // product_varients,
        // getproduct_varients,
        // getProductById,
        createProductVariant,
        // updateProduct,
        // deleteProduct,
        error,
        isLoading,
    };
};

export default useProductVariant;
