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
    const createProductVariant = async (data: ProductVariant, files: File[]) => {
        try {
            setIsLoading(true);

            // Tạo một đối tượng FormData để gửi dữ liệu
            const formData = new FormData();

            // Thêm dữ liệu từ ProductVariant vào formData
            formData.append("product_id", data.product_id ? data.product_id.toString() : ""); // Chuyển đổi số thành chuỗi
            data.colors.forEach((color) => formData.append("colors[]", color)); // Gửi mảng màu
            data.sizes.forEach((size) => formData.append("sizes[]", size)); // Gửi mảng kích thước

            // Thêm số lượng vào formData
            for (const [key, value] of Object.entries(data.quantities)) {
                formData.append(`quantities[${key}]`, value.toString());
            }

            // Thêm giá vào formData
            for (const [key, value] of Object.entries(data.prices)) {
                formData.append(`prices[${key}]`, value.toString());
            }

            for (const [key, value] of Object.entries(data.sale_prices)) {
                formData.append(`sale_prices[${key}]`, value.toString());
            }

            for (const [key, value] of Object.entries(data.sale_starts)) {
                formData.append(`sale_starts[${key}]`, value.toString());
            }

            for (const [key, value] of Object.entries(data.sale_ends)) {
                formData.append(`sale_ends[${key}]`, value.toString());
            }

            // Thêm đường dẫn hình ảnh vào formData
            for (const [key, file] of Object.entries(data.images)) {
                formData.append(`images[${key}]`, file); // Gửi file ảnh
            }

            formData.append("status", data.status); // Thêm trạng thái

            // Thêm các file tương ứng vào formData
            // if (files.length > 0) {
            //     // Kiểm tra nếu có file
            //     files.forEach((file, index) => {
            //         formData.append(`image[${index}]`, file); // Gửi file ảnh
            //     });
            // }

            const response = await axios.post("http://localhost:8000/api/product-variants", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const productData = response.data;
            return productData;
        } catch (err) {
            setError("Failed to create Product Variant");
            console.error(err); // In ra lỗi để dễ dàng theo dõi
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
            console.error("Failed to fetch product variant:", error);
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
