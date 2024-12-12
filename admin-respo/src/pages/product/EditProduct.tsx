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
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // Ảnh mới được chọn
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [categoryError, setCategoryError] = useState(""); // Lỗi khi lấy danh mục

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/product/${id}`
        );
        const data = response.data;

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
        setInitialData({ ...data });
      } catch (err) {
        setError("Không thể lấy thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  const handleInputChange = (field, value) => {
    setInputObject((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file) => {
    setSelectedImage(file);
  };

  const handleSubmit = async () => {
    if (!inputObject.name.trim()) {
      alert("Tên sản phẩm là bắt buộc!");
      return;
    }

    const updatedFields = {
      name: inputObject.name,
      description: inputObject.description || "",
      price: inputObject.price,
      sale_price: inputObject.sale_price || "",
      category_id: inputObject.category_id,
      sale_start: inputObject.sale_start || "",
      sale_end: inputObject.sale_end || "",
      new_product: inputObject.new_product ? 1 : 0,
      best_seller_product: inputObject.best_seller_product ? 1 : 0,
      featured_product: inputObject.featured_product ? 1 : 0,
      image: inputObject.image || "",
      quantity: inputObject.quantity,
    };

    Object.keys(inputObject).forEach((key) => {
      if (inputObject[key] !== initialData[key]) {
        updatedFields[key] = inputObject[key];
      }
    });

    if (Object.keys(updatedFields).length === 0 && !selectedImage) {
      alert("Không có thay đổi nào để cập nhật.");
      return;
    }

    const formData = new FormData();
    let isImageChanged = false;
    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] !== "") {
        formData.append(key, updatedFields[key]);
      }
    });

    if (selectedImage) {
      formData.append("image", selectedImage);
      isImageChanged = true;
    }

    try {
      if (isImageChanged) {
        await axios.put(`http://127.0.0.1:8000/api/product/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
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
                        className="input w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-blackPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="input w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-blackPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={inputObject.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
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
                        className="input w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-blackPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      Ngày bắt đầu giảm giá
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        className="input w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-blackPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="input w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-blackPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        onChange={(e) =>
                          handleInputChange(
                            "new_product",
                            e.target.checked ? 1 : 0
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Sản phẩm bán chạy
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={inputObject.best_seller_product === 1}
                        onChange={(e) =>
                          handleInputChange(
                            "best_seller_product",
                            e.target.checked ? 1 : 0
                          )
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Sản phẩm nổi bật
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={inputObject.featured_product === 1}
                        onChange={(e) =>
                          handleInputChange(
                            "featured_product",
                            e.target.checked ? 1 : 0
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
                        className="input w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-blackPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={inputObject.quantity}
                        onChange={(e) =>
                          handleInputChange("quantity", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2 text-gray-700 dark:text-whiteSecondary">
                      Ảnh
                    </td>
                    <td className="px-4 py-2">
                      <ImageUpload
                        imageUrl={inputObject.image}
                        onImageChange={handleImageChange}
                      />
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
