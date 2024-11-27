import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Sidebar, ImageUpload } from "../../components";
import { HiOutlineSave } from "react-icons/hi";

const EditProduct = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [inputObject, setInputObject] = useState({
    name: "",
    description: "",
    category_id: 0,
    price: "",
    sale_price: "",
    sale_start: "",
    sale_end: "",
    new_product: 0,
    best_seller_product: 0,
    featured_product: 0,
    image: "",
    quantity: "",
  });
  const [initialData, setInitialData] = useState(null); // Lưu dữ liệu ban đầu để so sánh
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // Ảnh mới được chọn
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [categoryError, setCategoryError] = useState(""); // Lỗi khi lấy danh mục

  // Lấy thông tin sản phẩm từ ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/product/${id}`
        );
        const data = response.data;

        // Gán dữ liệu vào state
        setInputObject({
          name: data.name || "",
          description: data.description || "",
          category_id: data.category_id || 0,
          price: data.price || "",
          sale_price: data.sale_price || "",
          sale_start: data.sale_start || "",
          sale_end: data.sale_end || "",
          new_product: data.new_product || 0,
          best_seller_product: data.best_seller_product || 0,
          featured_product: data.featured_product || 0,
          image: data.image || "",
          quantity: data.quantity || "",
        });
        setInitialData({ ...data }); // Lưu dữ liệu ban đầu
      } catch (err) {
        setError("Không thể lấy thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories"
        );
        setCategories(response.data.categories);
      } catch (err) {
        setCategoryError("Không thể lấy danh sách danh mục.");
      }
    };

    fetchCategories();
  }, []);

  // Xử lý thay đổi input
  const handleInputChange = (field, value) => {
    setInputObject((prev) => ({ ...prev, [field]: value }));
  };

  // Xử lý thay đổi ảnh
  const handleImageChange = (file) => {
    setSelectedImage(file);
  };

  // Gửi dữ liệu cập nhật sản phẩm
  const handleSubmit = async () => {
    // Kiểm tra nếu tên sản phẩm không có giá trị
    if (!inputObject.name.trim()) {
      alert("Tên sản phẩm là bắt buộc!");
      return;
    }

    // Lọc các trường đã thay đổi
    const updatedFields: any = {
      name: inputObject.name,
      description: inputObject.description || "", // Nếu không có mô tả, gán là chuỗi rỗng
      price: inputObject.price,
      sale_price: inputObject.sale_price || "", // Nếu không có giá giảm, gán là chuỗi rỗng
      category_id: inputObject.category_id,
      sale_start: inputObject.sale_start || "", // Nếu không có, gán là chuỗi rỗng
      sale_end: inputObject.sale_end || "", // Nếu không có, gán là chuỗi rỗng
      new_product: inputObject.new_product ? 1 : 0, // Nếu là sản phẩm mới, gán 1, nếu không thì 0
      best_seller_product: inputObject.best_seller_product ? 1 : 0, // Tương tự với best seller
      featured_product: inputObject.featured_product ? 1 : 0, // Tương tự với featured
      image: inputObject.image || "", // Đảm bảo hình ảnh có giá trị, nếu không thì gán rỗng
      quantity: inputObject.quantity,
    };

    // Lọc những trường đã thay đổi so với dữ liệu ban đầu
    Object.keys(inputObject).forEach((key) => {
      if (inputObject[key] !== initialData[key]) {
        updatedFields[key] = inputObject[key];
      }
    });

    // Nếu không có thay đổi và không có ảnh mới, thông báo và dừng lại
    if (Object.keys(updatedFields).length === 0 && !selectedImage) {
      alert("Không có thay đổi nào để cập nhật.");
      return;
    }

    // Tạo FormData nếu có ảnh mới
    const formData = new FormData();
    let isImageChanged = false;

    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] !== "") {
        formData.append(key, updatedFields[key]);
      }
    });

    // Nếu có hình ảnh mới, thêm vào FormData và đánh dấu
    if (selectedImage) {
      formData.append("image", selectedImage);
      isImageChanged = true; // Đánh dấu đã có thay đổi ảnh
    }

    // Gửi dữ liệu dưới dạng FormData nếu có ảnh, nếu không thì dưới dạng JSON
    try {
      if (isImageChanged) {
        // Gửi FormData khi có ảnh
        await axios.put(`http://127.0.0.1:8000/api/product/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Gửi dữ liệu dưới dạng JSON nếu không có ảnh mới
        await axios.put(
          `http://127.0.0.1:8000/api/product/${id}`,
          updatedFields
        );
      }

      alert("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-auto flex bg-whiteSecondary dark:bg-blackPrimary border-t border-blackSecondary">
      <Sidebar />
      <div className="w-full bg-whiteSecondary dark:bg-blackPrimary">
        <div className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center flex-col sm:flex-row gap-5">
            <h2 className="text-3xl font-bold text-blackPrimary dark:text-whiteSecondary">
              Sửa Sản Phẩm
            </h2>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-x-2 w-48 py-2 bg-blackPrimary hover:bg-blackSecondary dark:bg-whiteSecondary dark:hover:bg-white text-whiteSecondary dark:text-blackPrimary text-lg font-semibold duration-200"
            >
              <HiOutlineSave className="text-xl" />
              Cập Nhật
            </button>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pt-8">
            <h3 className="text-2xl font-bold text-blackPrimary dark:text-whiteSecondary mb-6">
              Thông Tin Cơ Bản
            </h3>
            <div className="overflow-x-auto bg-white dark:bg-blackPrimary shadow-lg rounded-lg">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-lg font-semibold text-blackPrimary dark:text-whiteSecondary">
                      Trường
                    </th>
                    <th className="px-4 py-2 text-left text-lg font-semibold text-blackPrimary dark:text-whiteSecondary">
                      Giá trị
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Tên
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        className="input w-full"
                        value={inputObject.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Mô tả
                    </td>
                    <td className="px-4 py-2">
                      <textarea
                        className="input w-full"
                        value={inputObject.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Giá
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        className="input w-full"
                        value={inputObject.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Giá giảm
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        className="input w-full"
                        value={inputObject.sale_price}
                        onChange={(e) =>
                          handleInputChange("sale_price", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Ngày bắt đầu giảm giá
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        className="input w-full"
                        value={inputObject.sale_start}
                        onChange={(e) =>
                          handleInputChange("sale_start", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Ngày kết thúc giảm giá
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        className="input w-full"
                        value={inputObject.sale_end}
                        onChange={(e) =>
                          handleInputChange("sale_end", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Sản phẩm mới
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={inputObject.new_product === 1}
                        onChange={() =>
                          handleInputChange(
                            "new_product",
                            inputObject.new_product === 1 ? 0 : 1
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Bestseller
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={inputObject.best_seller_product === 1}
                        onChange={() =>
                          handleInputChange(
                            "best_seller_product",
                            inputObject.best_seller_product === 1 ? 0 : 1
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Featured
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={inputObject.featured_product === 1}
                        onChange={() =>
                          handleInputChange(
                            "featured_product",
                            inputObject.featured_product === 1 ? 0 : 1
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Số lượng
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        className="input w-full"
                        value={inputObject.quantity}
                        onChange={(e) =>
                          handleInputChange("quantity", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Danh mục
                    </td>
                    <td className="px-4 py-2">
                      <select
                        className="input w-full"
                        value={inputObject.category_id}
                        onChange={(e) =>
                          handleInputChange("category_id", e.target.value)
                        }
                      >
                        <option value={0}>Chọn danh mục</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Ảnh sản phẩm
                    </td>
                    <td className="px-4 py-2">
                      {inputObject.image && (
                        <img
                          src={inputObject.image}
                          alt="Current Product"
                          className="w-32 h-32 object-cover mb-2"
                        />
                      )}
                      <ImageUpload onFileChange={handleImageChange} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
