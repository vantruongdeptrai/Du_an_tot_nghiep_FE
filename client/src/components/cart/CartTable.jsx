import PropTypes from "prop-types";
import styled from "styled-components";
import formatCurrency from "../../utils/formatUtils";
import useCart from "../../hooks/useCart";
import { toast } from "react-toastify";
import { defaultTheme } from "../../styles/themes/default";
import Loader from "../../components/loader/loader";

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    border: none;

    th,
    td {
        padding: 12px;
        border: none;
        text-align: left;
        height: 100px;
        word-wrap: break-word; /* Bọc từ dài */
        word-break: break-word; /* Chia từ nếu cần */
        white-space: normal; /* Cho phép xuống dòng */
    }
    th {
        background-color: #f4f4f4;
    }

    .delete-button {
        background-color: red;
        color: white;
        border: 1px solid #cc0000; // Thêm border cho nút xóa
        border-radius: 8px; // Thêm bo góc cho nút
        padding: 6px 16px; // Điều chỉnh kích thước nút
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s; // Thêm hiệu ứng khi hover

        &:hover {
            background-color: darkred;
            transform: scale(1.1); // Thêm hiệu ứng phóng to khi hover
        }

        &:focus {
            outline: none; // Loại bỏ outline khi nút được nhấn
        }
    }

    .quantity-button {
        background-color: ${defaultTheme.color_sea_green};
        color: white;
        border: 1px solid ${defaultTheme.color_sea_green}; // Thêm border cho nút
        border-radius: 6px; // Thêm bo góc cho nút
        padding: 6px 16px; // Làm cho nút rộng ra
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s; // Thêm hiệu ứng khi hover

        &:hover {
            background-color: ${defaultTheme.color_sea_green_v1};
            transform: scale(1.05); // Thêm hiệu ứng phóng to khi hover
        }

        &:focus {
            outline: none; // Loại bỏ outline khi nút được nhấn
        }

        margin: 0 6px;
    }

    .quantity-value {
        border: 1px solid #ddd; // Thêm border cho số lượng
        padding: 6px 12px;
        border-radius: 6px;
        margin: 0 6px;
        min-width: 40px;
        text-align: center;
    }

    .product-name {
        white-space: normal; /* Cho phép xuống dòng */
        word-wrap: break-word; /* Bọc từ nếu quá dài */
        word-break: break-word; /* Chia nhỏ từ nếu cần */
        max-width: 150px; /* Giới hạn chiều rộng */
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
    const { deleteItem } = useCart();
    const handleDelete = (id) => {
        if (selectedItems.some((item) => item.cart_id === id)) {
            toast.warn("Không thể xóa sản phẩm đã chọn.");
            return;
        }
        if (window.confirm("Bạn thực sự muốn xóa giỏ?")) {
            deleteItem(id);
        }
    };

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
                                <td className="product-name">{item.name || item.product_name}</td>
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
                                            Size: {isLoggedIn ? item.size : getSizeName(item.size)}, Màu:{" "}
                                            {isLoggedIn ? item.color : getColorName(item.color)}
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
                                        onClick={() =>
                                            handleIncreaseQuantity(
                                                item.product_id,
                                                item.size,
                                                item.color,
                                                item.quantity
                                            )
                                        }
                                        disabled={isSelected}
                                    >
                                        +
                                    </button>
                                </td>
                                <td>{formatCurrency((item.price || 0) * item.quantity)}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDelete(item.cart_id)}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <div></div>
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
