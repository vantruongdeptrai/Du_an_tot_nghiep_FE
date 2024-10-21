import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import ProductFilter from "../../components/product/ProductFilter";

const ProductsContent = styled.div`
  display: grid;
  grid-template-columns: 320px auto;
  margin: 20px 0;

  @media (max-width: ${breakpoints.xl}) {
    grid-template-columns: 260px auto;
  }

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 100%;
    row-gap: 24px;
  }
`;

const ProductsContentLeft = styled.div`
  border: 1px solid rgba(190, 188, 189, 0.4);
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.05) 0 10px 50px;
  overflow: hidden;

  @media (max-width: ${breakpoints.lg}) {
    display: grid;
  }
`;

const ProductsContentRight = styled.div`
  padding: 16px 40px;

  .products-right-top {
    margin-bottom: 40px;
    @media (max-width: ${breakpoints.lg}) {
      margin-bottom: 24px;
    }
    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
      row-gap: 16px;
      align-items: flex-start;
    }
  }

  .product-card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 24px;
  }

  .product-card {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
    padding: 16px;
    transition: box-shadow 0.3s ease-in-out;
    &:hover {
      box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);
    }
  }

  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .product-info {
    padding: 16px;
  }

  .product-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .product-price {
    font-size: 16px;
    color: ${defaultTheme.color_black};
  }

  .new-product {
    background-color: green;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .category-info {
    font-size: 14px;
    color: #888;
    margin-top: 8px;
  }

  .add-to-cart {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: ${defaultTheme.color_sea_green};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: darken(${defaultTheme.color_sea_green}, 10%);
    }
  }

  @media (max-width: ${breakpoints.sm}) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      const productsResponse = await fetch(
        "http://127.0.0.1:8000/api/products"
      );
      const productsData = await productsResponse.json();
      setProducts(productsData);

      const categoriesResponse = await fetch(
        "http://127.0.0.1:8000/api/categories"
      );
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
    };

    fetchProductsAndCategories();
  }, []);

  const getCategoryById = (categoryId) => {
    return categories.find((category) => category.id === categoryId);
  };

  const handleAddToCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find((item) => item.product_id === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      const productToAdd = products.find((product) => product.id === productId);
      if (productToAdd) {
        cart.push({
          product_id: productToAdd.id,
          name: productToAdd.name,
          price: productToAdd.price,
          quantity: 1,
        });
      }
    }

    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Sản phẩm đã được thêm vào giỏ hàng (local storage)!");
    } else {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            product_id: productId,
            quantity: existingProduct ? existingProduct.quantity : 1,
            price: products.find((product) => product.id === productId).price,
          }),
        });

        if (response.ok) {
          alert("Sản phẩm đã được thêm vào giỏ hàng (database)!");
        } else {
          alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
        }
      } catch (error) {
        console.error("Lỗi khi gửi giỏ hàng lên server:", error);
        alert("Lỗi kết nối đến server.");
      }
    }
  };

  return (
    <ProductsContent>
      <ProductsContentLeft>
        <ProductFilter />
      </ProductsContentLeft>

      <ProductsContentRight>
        <div className="products-right-top">
          <h2>Danh sách sản phẩm</h2>
        </div>
        <div className="product-card-list">
          {products.map((product) => {
            const category = getCategoryById(product.category_id);
            return (
              <div key={product.id} className="product-card">
                <img
                  src={product.image || "https://picsum.photos/200/300"}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  {product.new_product && (
                    <span className="new-product">New</span>
                  )}
                  {category && (
                    <p className="category-info">Danh mục: {category.name}</p>
                  )}
                  <button
                    className="add-to-cart"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </ProductsContentRight>
    </ProductsContent>
  );
};

export default ProductListPage;
