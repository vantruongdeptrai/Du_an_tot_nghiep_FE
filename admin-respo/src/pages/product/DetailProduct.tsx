import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProductById = async (id: string | undefined) => {
    if (!id) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8000/api/products`);
      const foundProduct = response.data.find(
        (item: any) => item.id === parseInt(id)
      );

      if (foundProduct) {
        setProduct(foundProduct);
        await getCategoryById(foundProduct.category_id);
      } else {
        setError("Sản phẩm không tìm thấy");
      }
    } catch (error) {
      setError("Lỗi khi lấy sản phẩm");
      console.error("Lỗi khi lấy sản phẩm theo ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryById = async (categoryId: number) => {
    if (!categoryId) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/api/categories/${categoryId}`
      );
      setCategory(response.data);
    } catch (error) {
      setError("Danh mục không tìm thấy");
      console.error("Lỗi khi lấy danh mục theo ID:", error);
    }
  };

  useEffect(() => {
    getProductById(id);
  }, [id]);

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h1>{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", borderRadius: "5px", marginBottom: "10px" }}
      />
      <p>
        <strong>Giá:</strong> {product.price} $
      </p>
      <p>
        <strong>Danh mục:</strong> {category ? category.name : ""}
      </p>
      <p>
        <strong>Mô tả:</strong> {product.description}
      </p>
      <p>
        <strong>Số lượng:</strong> {product.quantity}
      </p>
      <p>
        <strong>SKU:</strong> {product.sku}
      </p>
      <p>
        <strong>Trạng thái:</strong> {product.status}
      </p>
      <p>
        <strong>Kích thước:</strong> {product.size}
      </p>
      <p>
        <strong>Màu sắc:</strong> {product.colour}
      </p>
    </div>
  );
};

export default DetailProduct;
