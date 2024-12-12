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
  const [editingVariant, setEditingVariant] = useState<any | null>(null);

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
      console.error("Lỗi khi lấy biến thể sản phẩm:", error);
      setError("Lỗi khi lấy biến thể sản phẩm");
    }
  };

  const getSizes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/sizes`);
      setSizes(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy kích thước:", error);
      setError("Lỗi khi lấy kích thước sản phẩm");
    }
  };

  const getColors = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/colors`);
      setColors(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy màu sắc:", error);
      setError("Lỗi khi lấy màu sắc sản phẩm");
    }
  };

  const handleSaveVariant = async () => {
    if (!editingVariant || !product) return;

    const {
      price,
      quantity,
      sku,
      color_name,
      size_name,
      sale_price,
      sale_start,
      sale_end,
    } = editingVariant;

    // Kiểm tra giá trị trước khi gửi yêu cầu
    if (isNaN(price) || isNaN(quantity)) {
      setError("Giá và số lượng phải là số hợp lệ.");
      return;
    }

    // Kiểm tra nếu sale_price chưa có giá trị
    if (sale_price === undefined || isNaN(sale_price)) {
      setError("Giá bán (sale_price) là bắt buộc và phải là số hợp lệ.");
      return;
    }

    // Kiểm tra nếu sale_start chưa có giá trị
    if (!sale_start) {
      setError(
        "Ngày bắt đầu chương trình khuyến mãi (sale_start) là bắt buộc."
      );
      return;
    }

    // Kiểm tra nếu sale_end chưa có giá trị
    if (!sale_end) {
      setError("Ngày kết thúc chương trình khuyến mãi (sale_end) là bắt buộc.");
      return;
    }

    // Chuyển sale_start và sale_end thành định dạng ngày hợp lệ (YYYY-MM-DD)
    const formattedSaleStart = new Date(sale_start).toISOString().split("T")[0]; // Lấy phần ngày
    const formattedSaleEnd = new Date(sale_end).toISOString().split("T")[0]; // Lấy phần ngày

    // Tìm size_id và color_id tương ứng
    const size = sizes.find((s) => s.name === size_name);
    const color = colors.find((c) => c.name === color_name);

    if (!size || !color) {
      setError("Kích thước hoặc màu sắc không hợp lệ.");
      return;
    }

    // Đảm bảo rằng status là một giá trị hợp lệ (ví dụ: 0 hoặc 1)
    const status = product.status !== undefined ? product.status : 1; // Mặc định là 1 nếu không có giá trị

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/product-variants/${editingVariant.id}`,
        {
          product_id: product.id, // Thêm product_id
          price: price,
          sale_price: sale_price, // Thêm sale_price vào payload
          quantity: quantity,
          sku: sku,
          size_id: size.id, // Sử dụng size_id thay vì size_name
          color_id: color.id, // Sử dụng color_id thay vì color_name
          status: status, // Thêm status
          sale_start: formattedSaleStart, // Thêm sale_start vào payload
          sale_end: formattedSaleEnd, // Thêm sale_end vào payload
        }
      );

      // Cập nhật lại danh sách biến thể sau khi sửa
      setEditingVariant(null);
      await getProductVariantById(product?.id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi khi lưu biến thể:", error.response?.data);
        setError("Lỗi khi lưu biến thể: " + error.response?.data?.message);
      } else {
        setError("Lỗi không xác định khi lưu biến thể");
      }
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
                        <strong>Giá:</strong>{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(variant.price)}
                      </p>
                      <button
                        onClick={() => setEditingVariant(variant)}
                        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form chỉnh sửa biến thể */}
      {editingVariant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-2xl font-bold mb-4">Chỉnh sửa biến thể</h3>

            {/* Các trường nhập thông tin khác */}
            <div className="mb-4">
              <label className="block text-gray-700">Giá:</label>
              <input
                type="number"
                value={editingVariant.price}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    price: parseFloat(e.target.value),
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Số lượng:</label>
              <input
                type="number"
                value={editingVariant.quantity}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Mã SKU:</label>
              <input
                type="text"
                value={editingVariant.sku}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    sku: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>

            {/* Thêm trường sale_start */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Ngày bắt đầu khuyến mãi:
              </label>
              <input
                type="date" // Sử dụng type date thay vì datetime-local
                value={editingVariant.sale_start || ""}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    sale_start: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
                required
              />
            </div>

            {/* Thêm trường sale_end */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Ngày kết thúc khuyến mãi:
              </label>
              <input
                type="date" // Sử dụng type date thay vì datetime-local
                value={editingVariant.sale_end || ""}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    sale_end: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>

            {/* Các trường lựa chọn màu sắc và kích thước */}
            <div className="mb-4">
              <label className="block text-gray-700">Màu sắc:</label>
              <select
                value={editingVariant.color_name}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    color_name: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                {colors.map((color) => (
                  <option key={color.id} value={color.name}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Kích thước:</label>
              <select
                value={editingVariant.size_name}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    size_name: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                {sizes.map((size) => (
                  <option key={size.id} value={size.name}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút Lưu và Hủy */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveVariant}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Lưu
              </button>
              <button
                onClick={() => setEditingVariant(null)}
                className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduct;
