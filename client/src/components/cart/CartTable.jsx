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
  const handleDelete = async (productId) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    let updatedCart = cartItems.filter((item) => item.product_id !== productId);

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
            body: JSON.stringify({ product_id: productId }),
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

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.product_id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.product_id === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Tên sản phẩm</th>
          <th>Số lượng</th>
          <th>Giá</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <tr key={item.product_id}>
              <td>{item.product_name}</td>
              <td>
                <button
                  className="quantity-button"
                  onClick={() => handleDecreaseQuantity(item.product_id)}
                >
                  -
                </button>
                {item.quantity}
                <button
                  className="quantity-button"
                  onClick={() => handleIncreaseQuantity(item.product_id)}
                >
                  +
                </button>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.product_id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">Giỏ hàng của bạn hiện đang trống.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CartTable;
