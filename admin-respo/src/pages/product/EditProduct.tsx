import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Sidebar, ImageUpload } from "../../components";
import { HiOutlineSave } from "react-icons/hi";

const EditProduct = () => {
  const { id } = useParams();
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
    },
    sidebar: {
      backgroundColor: "#333",
      color: "#fff",
      width: "250px",
      padding: "20px",
    },
    mainContent: {
      width: "100%",
      padding: "20px",
    },
    sectionTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    th: {
      textAlign: "left",
      padding: "10px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
      borderBottom: "1px solid #ddd",
    },
    td: {
      padding: "10px",
      fontSize: "14px",
      color: "#555",
      borderBottom: "1px solid #ddd",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "14px",
      marginTop: "5px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "14px",
      marginTop: "5px",
      resize: "vertical",
    },
    button: {
      backgroundColor: "#1a73e8",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      padding: "10px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    imgPreview: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "8px",
      margin: "5px",
    },
    imageList: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    },
  };

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

    const updatedFields = { ...inputObject };

    const formData = new FormData();
    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] !== initialData[key]) {
        formData.append(key, updatedFields[key]);
      }
    });

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Cập nhật sản phẩm thành công!");
    } catch (err) {
      alert("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={styles.sectionTitle}>Sửa Sản Phẩm</h2>
          <button onClick={handleSubmit} style={styles.button}>
            <HiOutlineSave className="text-xl" />
            Cập Nhật
          </button>
        </div>

        {/* Basic Information Section */}
        <div>
          <h3 style={{ ...styles.sectionTitle, fontSize: "20px" }}>
            Thông Tin Cơ Bản
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Trường</th>
                  <th style={styles.th}>Giá trị</th>
                </tr>
              </thead>
              <tbody>
                {/* Tên */}
                <tr>
                  <td style={styles.td}>Tên</td>
                  <td style={styles.td}>
                    <input
                      type="text"
                      style={styles.input}
                      value={inputObject.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </td>
                </tr>
                {/* Mô tả */}
                <tr>
                  <td style={styles.td}>Mô tả</td>
                  <td style={styles.td}>
                    <textarea
                      style={styles.textarea}
                      value={inputObject.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </td>
                </tr>
                {/* Giá */}
                <tr>
                  <td style={styles.td}>Giá</td>
                  <td style={styles.td}>
                    <input
                      type="text"
                      style={styles.input}
                      value={inputObject.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                  </td>
                </tr>
                {/* Giá giảm */}
                <tr>
                  <td style={styles.td}>Giá giảm</td>
                  <td style={styles.td}>
                    <input
                      type="text"
                      style={styles.input}
                      value={inputObject.sale_price}
                      onChange={(e) =>
                        handleInputChange("sale_price", e.target.value)
                      }
                    />
                  </td>
                </tr>
                {/* Ngày bắt đầu giảm giá */}
                <tr>
                  <td style={styles.td}>Ngày bắt đầu giảm giá</td>
                  <td style={styles.td}>
                    <input
                      type="date"
                      style={styles.input}
                      value={inputObject.sale_start}
                      onChange={(e) =>
                        handleInputChange("sale_start", e.target.value)
                      }
                    />
                  </td>
                </tr>
                {/* Ngày kết thúc giảm giá */}
                <tr>
                  <td style={styles.td}>Ngày kết thúc giảm giá</td>
                  <td style={styles.td}>
                    <input
                      type="date"
                      style={styles.input}
                      value={inputObject.sale_end}
                      onChange={(e) =>
                        handleInputChange("sale_end", e.target.value)
                      }
                    />
                  </td>
                </tr>
                {/* Sản phẩm mới */}
                <tr>
                  <td style={styles.td}>Sản phẩm mới</td>
                  <td style={styles.td}>
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
                {/* Bestseller */}
                <tr>
                  <td style={styles.td}>Bestseller</td>
                  <td style={styles.td}>
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
                {/* Featured */}
                <tr>
                  <td style={styles.td}>Featured</td>
                  <td style={styles.td}>
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
                {/* Số lượng */}
                <tr>
                  <td style={styles.td}>Số lượng</td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      style={styles.input}
                      value={inputObject.quantity}
                      onChange={(e) =>
                        handleInputChange("quantity", e.target.value)
                      }
                    />
                  </td>
                </tr>
                {/* Danh mục */}
                <tr>
                  <td style={styles.td}>Danh mục</td>
                  <td style={styles.td}>
                    <select
                      style={styles.input}
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
                {/* Ảnh sản phẩm */}
                <tr>
                  <td style={styles.td}>Ảnh sản phẩm</td>
                  <td style={styles.td}>
                    {inputObject.image && (
                      <img
                        src={inputObject.image}
                        alt="Current Product"
                        style={styles.imgPreview}
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
  );
};

export default EditProduct;
