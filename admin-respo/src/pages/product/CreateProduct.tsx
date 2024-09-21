import React, { useState, useEffect } from "react";
import { useProduct } from "../../hooks/product";
import axios from "axios";
const CreateProduct = () => {
  const { createProduct } = useProduct();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    category_id: "",
    sale_start: new Date().toISOString().slice(0, 10),
    sale_end: new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .slice(0, 10),
    new_product: false,
    best_seller_product: false,
    featured_product: false,
    image: null,
    attributes: [],
    variants: [{ quantity: "", price: "", status: "", attributes: [] }],
  });
  const [categories, setCategories] = useState([]); // State để lưu danh sách danh mục
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [sizeAttributeId, setSizeAttributeId] = useState(null);
  const [colorAttributeId, setColorAttributeId] = useState(null);
  // Gọi API để lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/categories"
        ); // Đường dẫn API để lấy danh mục
        setCategories(response.data); // Giả sử API trả về một mảng danh mục
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/attributes"
        );
        setAttributes(response.data);

        // Tìm ID của thuộc tính "Size" và "Color"
        const sizeAttr = response.data.find(
          (attr) => attr.name.toLowerCase() === "size"
        );
        const colorAttr = response.data.find(
          (attr) => attr.name.toLowerCase() === "color"
        );

        if (sizeAttr) setSizeAttributeId(sizeAttr.id);
        if (colorAttr) setColorAttributeId(colorAttr.id);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };

    const fetchAttributeValues = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/attribute-values"
        );
        setAttributeValues(response.data);
      } catch (error) {
        console.error("Error fetching attribute values:", error);
      }
    };

    fetchAttributes();
    fetchAttributeValues();
  }, []);
  // Fetch attributes
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/attributes"
        );
        setAttributes(response.data);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };

    fetchAttributes();
  }, []);

  // Fetch attribute values
  useEffect(() => {
    const fetchAttributeValues = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/attribute-values"
        );
        setAttributeValues(response.data);
      } catch (error) {
        console.error("Error fetching attribute values:", error);
      }
    };

    fetchAttributeValues();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductData({
        ...productData,
        image: e.target.files[0],
      });
    }
  };

  // Hàm để thêm thuộc tính mới
  const handleAddAttribute = () => {
    setProductData({
      ...productData,
      attributes: [
        ...productData.attributes,
        { attribute_name: "", attribute_value: "" },
      ],
    });
  };

  // Hàm để thay đổi giá trị của thuộc tính
  const handleAttributeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const attributes = [...productData.attributes];
    attributes[index] = { ...attributes[index], [name]: value };
    setProductData({ ...productData, attributes });
  };

  // Hàm để xóa thuộc tính
  const handleRemoveAttribute = (index: number) => {
    const attributes = [...productData.attributes];
    attributes.splice(index, 1);
    setProductData({ ...productData, attributes });
  };

  // Hàm để thêm biến thể mới
  const handleAddVariant = () => {
    setProductData({
      ...productData,
      variants: [
        ...productData.variants,
        { quantity: "", price: "", status: "", attributes: [] },
      ],
    });
  };

  // Hàm để thay đổi thông tin của biến thể
  const handleVariantChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const variants = [...productData.variants];
    variants[index] = { ...variants[index], [name]: value };
    setProductData({ ...productData, variants });
  };

  // Hàm xử lý sự kiện submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    // Gửi dữ liệu thông tin chung của sản phẩm
    for (const key in productData) {
      if (key !== "variants" && key !== "attributes") {
        formData.append(key, productData[key as keyof typeof productData]);
      }
    }
    console.log(formData);
    // Gửi dữ liệu các thuộc tính
    productData.attributes.forEach((attr, index) => {
      formData.append(
        `attributes[${index}][attribute_name]`,
        attr.attribute_name
      );
      formData.append(
        `attributes[${index}][attribute_value]`,
        attr.attribute_value
      );
    });

    // Gửi dữ liệu biến thể
    productData.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][quantity]`, variant.quantity);
      formData.append(`variants[${index}][price]`, variant.price);
      formData.append(`variants[${index}][status]`, variant.status);
    });

    createProduct(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Thông tin chung của sản phẩm */}
      <label htmlFor="name">Product Name</label>
      <input
        type="text"
        name="name"
        value={productData.name}
        onChange={handleChange}
        placeholder="Enter product name"
        required
      />

      <label htmlFor="category">Category</label>
      <select
        name="category_id"
        value={productData.category_id}
        onChange={handleChange}
        required
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        value={productData.description}
        onChange={handleChange}
        placeholder="Enter product description"
      />

      <label htmlFor="price">Price</label>
      <input
        type="number"
        name="price"
        value={productData.price}
        onChange={handleChange}
        placeholder="Enter price"
        required
      />

      <label htmlFor="sale_price">Sale Price</label>
      <input
        type="number"
        name="sale_price"
        value={productData.sale_price}
        onChange={handleChange}
        placeholder="Enter sale price"
      />

      <label htmlFor="image">Product Image</label>
      <input type="file" name="image" onChange={handleImageChange} />

      <label htmlFor="sale_start">Sale Start</label>
      <input
        type="date"
        name="sale_start"
        value={productData.sale_start}
        onChange={handleChange}
      />

      <label htmlFor="sale_end">Sale End</label>
      <input
        type="date"
        name="sale_end"
        value={productData.sale_end}
        onChange={handleChange}
      />

      <label>
        <input
          type="checkbox"
          name="new_product"
          checked={productData.new_product}
          onChange={handleChange}
        />
        New Product
      </label>
      <label>
        <input
          type="checkbox"
          name="best_seller_product"
          checked={productData.best_seller_product}
          onChange={handleChange}
        />
        Best Seller
      </label>
      <label>
        <input
          type="checkbox"
          name="featured_product"
          checked={productData.featured_product}
          onChange={handleChange}
        />
        Featured Product
      </label>

      {/* Thuộc tính sản phẩm */}
      {/* Thuộc tính sản phẩm */}
      <div className="attribute-section">
        <h4>Attributes</h4>

        {/* Mặc định thuộc tính Size */}
        <div>
          <label>Size</label>
          <select
            name="size"
            value={productData.size}
            onChange={handleChange}
            required
          >
            <option value="">Select Size</option>
            {attributeValues
              .filter((value) => value.attribute_id === sizeAttributeId)
              .map((value) => (
                <option key={value.id} value={value.id}>
                  {value.value}
                </option>
              ))}
          </select>
        </div>

        {/* Mặc định thuộc tính Color */}
        <div>
          <label>Color</label>
          <select
            name="color"
            value={productData.color}
            onChange={handleChange}
            required
          >
            <option value="">Select Color</option>
            {attributeValues
              .filter((value) => value.attribute_id === colorAttributeId)
              .map((value) => (
                <option key={value.id} value={value.id}>
                  {value.value}
                </option>
              ))}
          </select>
        </div>

        {/* Thuộc tính mới */}
        {productData.attributes.map((attr, index) => (
          <div key={index}>
            <input
              type="text"
              name="attribute_name"
              value={attr.attribute_name}
              onChange={(e) => handleAttributeChange(index, e)}
              placeholder="New Attribute Name"
            />
            <input
              type="text"
              name="attribute_value"
              value={attr.attribute_value}
              onChange={(e) => handleAttributeChange(index, e)}
              placeholder="New Attribute Value"
            />
            <button type="button" onClick={() => handleRemoveAttribute(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" className="add-btn" onClick={handleAddAttribute}>
          Add Attribute
        </button>
      </div>

      {/* Biến thể sản phẩm */}
      <div className="variant-section">
        <h4>Variants</h4>
        {productData.variants.map((variant, index) => (
          <div key={index}>
            <input
              type="number"
              name="quantity"
              value={variant.quantity}
              onChange={(e) => handleVariantChange(index, e)}
              placeholder="Quantity"
            />
            <input
              type="number"
              name="price"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, e)}
              placeholder="Variant Price"
            />
            <input
              type="number"
              name="status"
              value={variant.status}
              onChange={(e) => handleVariantChange(index, e)}
              placeholder="Status"
            />
            <button type="button" onClick={() => handleRemoveVariant(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={handleAddVariant}>
          Add Variant
        </button>
      </div>

      <button type="submit" className="submit-btn">
        Create Product
      </button>
    </form>
  );
};

export default CreateProduct;
