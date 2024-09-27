import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Product, ProductInput } from "../api/products/types";

const useProduct = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const getProducts = async () => {
        try {
            setIsLoading(true);
            const respon = await axios.get("http://localhost:8000/api/products");
            setProducts(respon.data);
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm lấy danh mục theo ID
    const getProductById = async (id: string | undefined) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8000/api/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            setError("Product not found");
            console.error("Error fetching Product by ID:", error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm tạo danh mục với ảnh
    const createProduct = async (data: ProductInput, file?: File) => {
        const formData = new FormData();

        // Append thông tin danh mục vào FormData
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("description", data.description);
        formData.append("sale_price", data.sale_price);
        formData.append("sale_start", data.sale_start);
        formData.append("category_id", data.category_id.toString());
        formData.append("new_product", String(Number(data.new_product)));
        formData.append("best_seller_product", String(Number(data.best_seller_product)));
        formData.append("featured_product", String(Number(data.featured_product)));
        // Nếu có file ảnh thì thêm vào FormData
        if (file) {
            formData.append("image", file);
        }

        try {
            setIsLoading(true);
            const response = await axios.post("http://localhost:8000/api/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Product added successfully");
            const productData = response.data;
            return productData;
        } catch (err) {
            setError("Failed to create Product");
        } finally {
            setIsLoading(false);
        }
    };

    const updateProduct = async (data: ProductInput, file?: File) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("_method", "put");
        console.log(id);

        if (file) {
            formData.append("image", file);
        }

        try {
            await axios.post("http://localhost:8000/api/products/" + id, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Product edit successfully");
        } catch (error) {
            console.error("Error updating Product:", error);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            if (window.confirm("Are you sure you want to delete")) {
                setIsLoading(true);
                await axios.delete("http://localhost:8000/api/products/" + id);
                toast.success("Product delete successfully");
                getProducts();
            }
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);
    useEffect(() => {
        if (!id) return;
        getProductById(id);
    }, [id]);

    return {
        product,
        products,
        getProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        error,
        isLoading,
    };
};

export default useProduct;
