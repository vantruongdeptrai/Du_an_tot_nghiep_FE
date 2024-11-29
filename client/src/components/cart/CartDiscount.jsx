import styled from "styled-components";
import { useState } from "react";
import { Input } from "../../styles/form";
import { BaseButtonOuterspace, BaseLinkOutlinePlatinum } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import formatCurrency from "../../utils/formatUtils";

const CartDiscountWrapper = styled.div`
    @media (max-width: ${breakpoints.xl}) {
        max-width: 420px;
    }

    @media (max-width: ${breakpoints.md}) {
        max-width: 100%;
    }

    .coupon-group {
        margin-top: 20px;
        overflow: hidden;
        border-radius: 6px;
        height: 40px;
    }

    .coupon-input {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        border: 1px solid ${defaultTheme.color_platinum};
        padding-left: 12px;
        padding-right: 12px;
        border-right: none;
    }

    .coupon-btn {
        padding: 2px 16px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .contd-shop-btn {
        height: 40px;
        margin-top: 10px;
    }
`;

const CartDiscount = ({ coupons, setAppliedCoupon, selectedItems }) => {
    const [couponCode, setCouponCode] = useState("");

    // Hàm xử lý khi áp dụng mã giảm giá
    const handleApplyCoupon = (e) => {
        e.preventDefault();
         // Kiểm tra mã giảm giá có bị trống không
         const trimmedCouponCode = couponCode.trim();
         if (!trimmedCouponCode) {
             toast.warn("Vui lòng điền mã giảm giá!");
             return;
         }
         console.log(couponCode);
         
 
         const coupon = coupons.find((coupon) => coupon.name === trimmedCouponCode);
         
         if (!coupon) {
             toast.error("Mã giảm giá không hợp lệ!");
             return;
         }
 
         if (selectedItems.length === 0) {
             toast.warn("Vui lòng chọn ít nhất 1 sản phẩm để sử dụng mã giảm giá!");
             return;
         }
 
         const subTotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
 
         if (subTotal < coupon.min_order_value) {
             toast.warn(`Số tiền tối thiểu của bạn phải là ${formatCurrency(coupon.min_order_value)} để sử dụng mã giảm giá.`);
             return;
         }
 
         // Nếu mã giảm giá hợp lệ, cập nhật trạng thái
         setAppliedCoupon(coupon);
         toast.success("Áp mã giảm giá thành công.");
    };
    return (
        <CartDiscountWrapper>
            <h3 className="text-xxl text-outerspace">Mã giảm giá</h3>
            <p className="text-base text-gray">Nhập mã giảm giá (Nếu có)</p>
            <form action="" onSubmit={handleApplyCoupon}>
                <div className="coupon-group flex">
                    <Input
                        type="text"
                        className="coupon-input w-full"
                        placeholder="Mời nhập..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <BaseButtonOuterspace type="submit" className="coupon-btn no-wrap h-full">
                        Áp mã giảm giá
                    </BaseButtonOuterspace>
                </div>
            </form>
            <BaseLinkOutlinePlatinum as={BaseLinkOutlinePlatinum} to="/" className="contd-shop-btn w-full text-gray">
                Tiếp tục mua hàng
            </BaseLinkOutlinePlatinum>
        </CartDiscountWrapper>
    );
};

CartDiscount.propTypes = {
    coupons: PropTypes.array.isRequired, // Hoặc kiểu phù hợp với coupons của bạn
    setAppliedCoupon: PropTypes.func.isRequired, // Hàm cập nhật coupon
    selectedItems: PropTypes.arrayOf(
        // Đảm bảo selectedItems là một mảng
        PropTypes.shape({
            product_id: PropTypes.number.isRequired, // Hoặc kiểu phù hợp với dữ liệu của bạn
            product_variant_id: PropTypes.number.isRequired, // Tùy thuộc vào dữ liệu của bạn
            price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
        })
    ).isRequired, // Kiểu của selectedItems là mảng các sản phẩm
};

export default CartDiscount;
