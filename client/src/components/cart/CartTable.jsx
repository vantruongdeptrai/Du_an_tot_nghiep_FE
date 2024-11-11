import React from "react";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }

  .delete-button {
    background-color: red;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;

    &:hover {
      background-color: darkred;
    }
  }

  .quantity-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }

    margin: 0 4px;
  }
`;

const CartTable = ({ cartItems, setCartItems }) => {
  // Xử lý khi xóa sản phẩm khỏi giỏ hàng
  const handleDelete = async (productId, size, color) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    let updatedCart = cartItems.filter(
      (item) =>
        item.product_id !== productId ||
        item.size !== size ||
        item.color !== color
    );

    if (!user) {
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/cart/${user.id}/remove`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id: productId, size, color }),
          }
        );

        if (response.ok) {
          setCartItems(updatedCart);
        } else {
          console.error("Failed to delete item from server cart.");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  // Xử lý khi tăng số lượng sản phẩm
  const handleIncreaseQuantity = (productId, size, color) => {
    const updatedCart = cartItems.map((item) => {
      if (
        item.product_id === productId &&
        item.size === size &&
        item.color === color
      ) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Xử lý khi giảm số lượng sản phẩm
  const handleDecreaseQuantity = (productId, size, color) => {
    const updatedCart = cartItems.map((item) => {
      if (
        item.product_id === productId &&
        item.size === size &&
        item.color === color &&
        item.quantity > 1
      ) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Xử lý khi thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const { product_id, price, name, selectedSize, selectedColor } = product;

    // Kiểm tra nếu sự kết hợp size và color đã có trong giỏ hàng
    const existingItem = cartItems.find(
      (item) =>
        item.product_id === product_id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (existingItem) {
      // Nếu đã có, tăng số lượng
      const updatedCart = cartItems.map((item) => {
        if (
          item.product_id === product_id &&
          item.size === selectedSize &&
          item.color === selectedColor
        ) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      // Nếu chưa có, thêm mới vào giỏ hàng
      const newItem = {
        product_id,
        product_name: name,
        price: selectedSize && selectedColor ? price : product.basePrice, // Dùng giá biến thể nếu có, không có thì dùng giá gốc
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
      };
      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Tên sản phẩm</th>
          <th>Thể loại</th>
          <th>Số lượng</th>
          <th>Giá</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <tr key={index}>
              <td>{item.product_name}</td>
              <td>
                {item.size && item.color ? (
                  <>
                    Size: {item.size}, Màu: {item.color}
                  </>
                ) : (
                  <span>Không có biến thể</span>
                )}
              </td>
              <td>
                <button
                  className="quantity-button"
                  onClick={() =>
                    handleDecreaseQuantity(
                      item.product_id,
                      item.size,
                      item.color
                    )
                  }
                >
                  -
                </button>
                {item.quantity}
                <button
                  className="quantity-button"
                  onClick={() =>
                    handleIncreaseQuantity(
                      item.product_id,
                      item.size,
                      item.color
                    )
                  }
                >
                  +
                </button>
              </td>
              <td>${((item.price || 0) * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(item.product_id, item.size, item.color)
                  }
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">Giỏ hàng của bạn hiện đang trống.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CartTable;
