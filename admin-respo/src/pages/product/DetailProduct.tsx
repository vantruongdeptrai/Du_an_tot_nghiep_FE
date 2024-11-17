import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(product);

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
        await getProductVariantById(foundProduct.id);
        await getSizes();
        await getColors();
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

  const getProductVariantById = async (product_id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/product-variants`
      );
      const variantsData = response.data.filter(
        (variant: any) => variant.product_id === parseInt(product_id)
      );
      setVariants(variantsData);
    } catch (error) {
      console.error("Failed to fetch product variant:", error);
      setError("Lỗi khi lấy biến thể sản phẩm");
    }
  };

  const getSizes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/sizes`);
      setSizes(response.data);
    } catch (error) {
      console.error("Failed to fetch sizes:", error);
      setError("Lỗi khi lấy kích thước sản phẩm");
    }
  };

  const getColors = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/colors`);
      setColors(response.data);
    } catch (error) {
      console.error("Failed to fetch colors:", error);
      setError("Lỗi khi lấy màu sắc sản phẩm");
    }
  };

  useEffect(() => {
    getProductById(id);
  }, [id]);

  if (isLoading)
    return <div className="text-center text-lg font-semibold">Đang tải...</div>;
  if (error)
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        {error}
      </div>
    );
  if (!product)
    return <div className="text-center text-lg">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        {product.name}
      </h1>

      {/* Bố cục 2 cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột hình ảnh */}
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg shadow-md object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Cột thông tin chi tiết */}
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            <span className="text-gray-600">Giá:</span>{" "}
            <span className="text-blue-600">{product.price} $</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-gray-600">Danh mục:</span>{" "}
            {category ? category.name : "Không xác định"}
          </p>
          <p className="text-lg font-semibold">
            <span className="text-gray-600">Trạng thái:</span>{" "}
            <span
              className={`${
                product.status === 1 ? "text-red-500" : "text-green-500"
              } font-bold`}
            >
              {product.status === 1 ? "Hết hàng" : "Còn hàng"}
            </span>
          </p>

          {/* Biến thể sản phẩm */}
          {variants.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Biến thể sản phẩm:
              </h2>
              <div className="space-y-4">
                {variants.map((variant) => {
                  const size = sizes.find((s) => s.id === variant.size_id);
                  const color = colors.find((c) => c.id === variant.color_id);
                  return (
                    <div
                      key={variant.id}
                      className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
                    >
                      <p className="text-gray-700">
                        <strong>Màu sắc:</strong>{" "}
                        {color ? color.name : "Không xác định"}
                      </p>
                      <p className="text-gray-700">
                        <strong>Kích thước:</strong>{" "}
                        {size ? size.name : "Không xác định"}
                      </p>
                      <p className="text-gray-700">
                        <strong>Số lượng:</strong> {variant.quantity}
                      </p>
                      <p className="text-gray-700">
                        <strong>SKU:</strong> {variant.sku}
                      </p>
                      <p className="text-gray-700">
                        <strong>Giá:</strong> {variant.price} $
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Mô tả sản phẩm:
        </h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>
    </div>
  );
};

export default DetailProduct;
