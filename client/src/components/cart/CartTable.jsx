import React from "react";
import PropTypes from 'prop-types';
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

const CartTable = ({ cartItems, selectedItems, onSelectItem, handleIncreaseQuantity, handleDecreaseQuantity }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Chọn</th>
          <th>Tên sản phẩm</th>
          <th>Ảnh</th>
          <th>Thể loại</th>
          <th>Số lượng</th>
          <th>Giá</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => {
            const isSelected = selectedItems.some(
              (selected) =>
                selected.product_id === item.product_id &&
                selected.size === item.size &&
                selected.color === item.color
            );

            return (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectItem(item)}
                  />
                </td>
                <td>{item.name || item.product_name}</td>
                <td>
                  <img src={item.product_image || item.image} alt="" style={{width: "50px", height: "50px"}} />
                </td>
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
                  {/* Nút tăng giảm số lượng */}
                  <button
                    className="quantity-button"
                    onClick={() =>
                      handleDecreaseQuantity(
                        item.product_id,
                        item.size,
                        item.color
                      )
                    }
                    disabled={isSelected}
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
                    disabled={isSelected}
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
            );
          })
        ) : (
          <tr>
            <td colSpan="6">Giỏ hàng của bạn hiện đang trống.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

CartTable.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      product_id: PropTypes.string.isRequired,
      product_name: PropTypes.string.isRequired,
      product_image: PropTypes.string.isRequired,
      size: PropTypes.string,
      color: PropTypes.string,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      product_id: PropTypes.string.isRequired,
      size: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
  onSelectItem: PropTypes.func.isRequired,
  handleIncreaseQuantity: PropTypes.func.isRequired,
  handleDecreaseQuantity: PropTypes.func.isRequired,
};

export default CartTable;
