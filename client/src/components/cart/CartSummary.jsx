import styled from "styled-components";
import { useState, useEffect } from "react";
import { BaseButtonGreen } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import formatCurrency from "../../utils/formatUtils";
import useProductVariant from "../../hooks/useProductVariant";

const CartSummaryWrapper = styled.div`
    background-color: ${defaultTheme.color_flash_white};
    padding: 16px;
    border-radius: 5px;

    .checkout-btn {
        min-width: 100%;
    }

    .summary-list {
        padding: 20px;

        @media (max-width: ${breakpoints.xs}) {
            padding-top: 0;
            padding-right: 0;
            padding-left: 0;
        }

        .summary-item {
            margin: 6px 0;

            &:last-child {
                margin-top: 20px;
                border-top: 1px dashed ${defaultTheme.color_sea_green};
                padding-top: 10px;
            }
        }
    }
`;

// Phí vận chuyển cố định
const SHIPPING_FEE = 0;

const CartSummary = ({ selectedItems, appliedCoupon }) => {
    const navigate = useNavigate();
    const { productVariants } = useProductVariant();

    const [subTotal, setSubtotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [isDiscountValid, setIsDiscountValid] = useState(true);
    // Tính tổng tiền cho các sản phẩm đã chọn
    useEffect(() => {
        // Tính tổng tiền cho các sản phẩm đã chọn
        const newSubtotal = selectedItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        // Kiểm tra nếu coupon có giá trị min_order_value
        if (appliedCoupon && newSubtotal < appliedCoupon.min_order_value) {
            setIsDiscountValid(false);
            setDiscount(0); // Nếu không đủ điều kiện áp dụng giảm giá
        } else {
            setIsDiscountValid(true);
            setDiscount(appliedCoupon ? (appliedCoupon.discount_amount / 100) * newSubtotal : 0);
        }

        // Cập nhật subtotal và grandTotal
        setSubtotal(newSubtotal);
        setGrandTotal(newSubtotal - discount + SHIPPING_FEE); // Thêm phí vận chuyển
    }, [selectedItems, appliedCoupon, discount]);
    // Hàm xử lý khi người dùng nhấn nút "Proceed To CheckOut"
    const handleProceedToCheckout = () => {
        if (selectedItems.length === 0) {
            toast.warn("Vui lòng chọn 1 sản phẩm muốn mua!");
            return;
        }
        if (!isDiscountValid) {
            toast.warn("Đơn đặt hàng của bạn không đáp ứng số tiền tối thiểu để được giảm giá!");
            return;
        }

        for (const item of selectedItems) {
            const variant = productVariants.find((pv) => pv.id === item.product_variant_id);
            if (!variant) {
                toast.error(`Không tìm thấy thông tin biến thể cho sản phẩm: ${item.product_name}`);
                return;
            }
            if (item.quantity > variant.quantity) {
                toast.error(
                    `Sản phẩm "${item.product_name}" chỉ còn ${variant.quantity} sản phẩm, vui lòng giảm số lượng.`
                );
                return;
            }
        }
        const orderItems = selectedItems.map((item) => ({
            product_id: item.product_id,
            product_variant_id: item.product_variant_id,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            discount: discount,
            coupon_name: appliedCoupon?.name,
        }));
        

        const isUserLoggedIn = !!localStorage.getItem("userInfo"); // Hoặc kiểm tra token/cookie

        if (!isUserLoggedIn) {
            // Lưu thông tin đơn hàng vào localStorage dành cho khách
            localStorage.setItem("guestOrder", JSON.stringify(orderItems));
            navigate("/checkout");
        }
        localStorage.setItem("orderItems", JSON.stringify(orderItems));
        navigate("/checkout");
    };

    return (
        <CartSummaryWrapper>
            <ul className="summary-list">
                <li className="summary-item flex justify-between">
                    <span className="font-medium text-outerspace">Tổng phụ</span>
                    <span className="font-medium text-outerspace">{formatCurrency(subTotal)}</span>
                </li>
                <li className="summary-item flex justify-between">
                    <span className="font-medium text-outerspace">Tiết kiệm</span>
                    <span className="font-medium text-outerspace">{formatCurrency(discount)}</span>
                </li>
                <li className="summary-item flex justify-between">
                    <span className="font-medium text-outerspace">Phí ship</span>
                    <span className="font-medium text-outerspace">{formatCurrency(SHIPPING_FEE)}</span>
                </li>
                <li className="summary-item flex justify-between">
                    <span className="font-medium text-outerspace">Tổng tiền</span>
                    <span className="summary-item-value font-bold text-outerspace">{formatCurrency(grandTotal)}</span>
                </li>
            </ul>
            <BaseButtonGreen type="submit" className="checkout-btn" onClick={handleProceedToCheckout}>
                Thanh toán
            </BaseButtonGreen>
        </CartSummaryWrapper>
    );
};

CartSummary.propTypes = {
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            product_id: PropTypes.number.isRequired,
            product_variants_id: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
        })
    ).isRequired,
    appliedCoupon: PropTypes.shape({
        discount_amount: PropTypes.number.isRequired,
        min_order_value: PropTypes.number.isRequired,
    }), // Giảm giá từ mã coupon
};

export default CartSummary;
