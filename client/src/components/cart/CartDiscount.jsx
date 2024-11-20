import styled from "styled-components";
import { useState } from "react";
import { Input } from "../../styles/form";
import { BaseButtonOuterspace, BaseLinkOutlinePlatinum } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
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
    console.log(couponCode);

    // Hàm xử lý khi áp dụng mã giảm giá
    const handleApplyCoupon = (e) => {
        e.preventDefault();
        const coupon = coupons.find((coupon) => coupon.name == couponCode);

        // Thay đổi từ toast.err thành toast.error
        if (!coupon) {
            toast.error("Invalid coupon code!");
            return;
        }

        if (selectedItems.length === 0) {
            toast.warn("Please select at least one product to apply the coupon!");
            return;
        }

        const subTotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
        console.log(subTotal);
        
        if (subTotal < coupon.min_order_value) {
            toast.warn(`Your total must be at least ${formatCurrency(coupon.min_order_value)} to apply a coupon.`);
            return;
        }

        // Nếu mã giảm giá hợp lệ, cập nhật trạng thái
        setAppliedCoupon(coupon);
        toast.success("Coupon applied successfully!");
    };
    return (
        <CartDiscountWrapper>
            <h3 className="text-xxl text-outerspace">Discount Codes</h3>
            <p className="text-base text-gray">Enter your coupon code if you have one.</p>
            <form action="" onSubmit={handleApplyCoupon}>
                <div className="coupon-group flex">
                    <Input
                        type="text"
                        className="coupon-input w-full"
                        placeholder="Search"
                        value={couponCode}
                        onInput={(e) => setCouponCode(e.target.value)}
                    />
                    <BaseButtonOuterspace type="submit" className="coupon-btn no-wrap h-full">
                        Apply Coupon
                    </BaseButtonOuterspace>
                </div>
            </form>
            <BaseLinkOutlinePlatinum as={BaseLinkOutlinePlatinum} to="/" className="contd-shop-btn w-full text-gray">
                continue shopping
            </BaseLinkOutlinePlatinum>
        </CartDiscountWrapper>
    );
};

CartDiscount.propTypes = {
  coupons: PropTypes.array.isRequired, // Hoặc kiểu phù hợp với coupons của bạn
  setAppliedCoupon: PropTypes.func.isRequired, // Hàm cập nhật coupon
  selectedItems: PropTypes.arrayOf( // Đảm bảo selectedItems là một mảng
      PropTypes.shape({
          product_id: PropTypes.number.isRequired, // Hoặc kiểu phù hợp với dữ liệu của bạn
          product_variant_id: PropTypes.number.isRequired, // Tùy thuộc vào dữ liệu của bạn
          price: PropTypes.number.isRequired,
          quantity: PropTypes.number.isRequired,
      })
  ).isRequired, // Kiểu của selectedItems là mảng các sản phẩm
};

export default CartDiscount;
