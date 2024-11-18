import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatCurrency from "../../utils/formatUtils";
import { products } from "../../data/data";

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

const CartTable = ({
    cartItems,
    selectedItems,
    onSelectItem,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    sizes,
    colors,
    isLoggedIn,
}) => {
    const getColorName = (colorId) => {
        const color = colors?.find((color) => color.id === colorId); // Tìm màu sắc tương ứng
        return color ? color.name : colorId; // Nếu tìm thấy, trả về name, nếu không thì trả về id
    };

    const getSizeName = (sizeId) => {
        const size = sizes?.find((size) => size.id === sizeId); // Tìm size tương ứng
        return size ? size.name : sizeId; // Nếu tìm thấy, trả về name, nếu không thì trả về id
    };

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
                                    <input type="checkbox" checked={isSelected} onChange={() => onSelectItem(item)} />
                                </td>
                                <td
                                    style={{
                                        whiteSpace: "nowrap",
                                        width: 50,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                    className="product-name"
                                >
                                    {item.name || item.product_name}
                                </td>
                                <td>
                                    <img
                                        src={item.product_image || item.image}
                                        alt=""
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                </td>
                                <td>
                                    {item.size && item.color ? (
                                        <>
                                            Size: {isLoggedIn ? item.size : getSizeName(item.size)}, Màu: {isLoggedIn ? item.color : getColorName(item.color)}
                                        </>
                                    ) : (
                                        <span>Không có biến thể</span>
                                    )}
                                </td>
                                <td>
                                    {/* Nút tăng giảm số lượng */}
                                    <button
                                        className="quantity-button"
                                        onClick={() => handleDecreaseQuantity(item.product_id, item.size, item.color)}
                                        disabled={isSelected}
                                    >
                                        -
                                    </button>
                                    {item.quantity}
                                    <button
                                        className="quantity-button"
                                        onClick={() => handleIncreaseQuantity(item.product_id, item.size, item.color)}
                                        disabled={isSelected}
                                    >
                                        +
                                    </button>
                                </td>
                                <td>{formatCurrency((item.price || 0) * item.quantity)}</td>
                                <td>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(item.product_id, item.size, item.color)}
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
    sizes: PropTypes.array.isRequired,
    colors: PropTypes.array.isRequired,
    isLoggedIn: PropTypes.bool.isRequired, // Sửa kiểu cho isLoggedIn là boolean
};

export default CartTable;
