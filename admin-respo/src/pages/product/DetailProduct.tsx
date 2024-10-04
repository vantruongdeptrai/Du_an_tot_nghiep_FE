import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]); // Biến thể sản phẩm
  const [sizes, setSizes] = useState<any[]>([]); // Danh sách size
  const [colors, setColors] = useState<any[]>([]); // Danh sách màu sắc
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
        await getProductVariantById(foundProduct.id); // Luôn gọi hàm lấy biến thể sản phẩm
        await getSizes(); // Lấy danh sách kích thước
        await getColors(); // Lấy danh sách màu sắc
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

  // Hàm để lấy dữ liệu biến thể sản phẩm
  const getProductVariantById = async (product_id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/product-variants`
      );
      const variantsData = response.data.filter(
        (variant: any) => variant.product_id === parseInt(product_id)
      );
      setVariants(variantsData); // Lưu dữ liệu biến thể vào state
    } catch (error) {
      console.error("Failed to fetch product variant:", error);
      setError("Lỗi khi lấy biến thể sản phẩm");
    }
  };

  // Hàm lấy danh sách size
  const getSizes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/sizes`);
      setSizes(response.data); // Lưu danh sách kích thước
    } catch (error) {
      console.error("Failed to fetch sizes:", error);
      setError("Lỗi khi lấy kích thước sản phẩm");
    }
  };

  // Hàm lấy danh sách màu sắc
  const getColors = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/colors`);
      setColors(response.data); // Lưu danh sách màu sắc
    } catch (error) {
      console.error("Failed to fetch colors:", error);
      setError("Lỗi khi lấy màu sắc sản phẩm");
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
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #eaeaea",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          marginBottom: "20px",
          textAlign: "center",
          color: "#333",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {product.name}
      </h1>
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          borderRadius: "8px",
          marginBottom: "20px",
          objectFit: "cover",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ flex: "1 1 45%" }}>
          <p>
            <strong>Giá:</strong> {product.price} $
          </p>
          <p>
            <strong>Danh mục:</strong>{" "}
            {category ? category.name : "Không xác định"}
          </p>
        </div>
        <div style={{ flex: "1 1 45%" }}>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span
              style={{
                color: product.status === 1 ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {product.status === 1 ? "hết hàng" : "còn hàng"}
            </span>
          </p>
        </div>
      </div>

      {/* Hiển thị biến thể sản phẩm nếu có biến thể */}
      {variants.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3
            style={{
              fontSize: "22px",
              marginBottom: "10px",
              color: "#555",
              borderBottom: "2px solid #eaeaea",
              paddingBottom: "10px",
            }}
          >
            Biến thể sản phẩm:
          </h3>
          {variants.map((variant) => {
            const size = sizes.find((s) => s.id === variant.size_id);
            const color = colors.find((c) => c.id === variant.color_id);
            return (
              <div
                key={variant.id}
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #eaeaea",
                  borderRadius: "5px",
                }}
              >
                <p>
                  <strong>Màu sắc:</strong>{" "}
                  {color ? color.name : "Không xác định"}
                </p>
                <p>
                  <strong>Kích thước:</strong>{" "}
                  {size ? size.name : "Không xác định"}
                </p>
                <p>
                  <strong>Số lượng:</strong> {variant.quantity}
                </p>
                <p>
                  <strong>SKU:</strong> {variant.sku}
                </p>
                <p>
                  <strong>Giá:</strong> {variant.price} $
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <h3
          style={{
            fontSize: "22px",
            marginBottom: "10px",
            color: "#555",
            borderBottom: "2px solid #eaeaea",
            paddingBottom: "10px",
          }}
        >
          Mô tả sản phẩm:
        </h3>
        <p style={{ lineHeight: "1.6", color: "#777" }}>
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default DetailProduct;
