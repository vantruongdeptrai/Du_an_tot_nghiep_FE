import styled from "styled-components";
import { useState } from "react";
import { Input } from "../../styles/form";
import { BaseButtonOuterspace, BaseLinkOutlinePlatinum } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import formatCurrency from "../../utils/formatUtils";
import useProductVariant from "../../hooks/useProductVariant";
import ModalVoucher from "../modals/ModalVoucher";

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

    .coupon-select {
        margin-top: 10px;
        width: 100%;
        padding: 8px;
        border: 1px solid ${defaultTheme.color_platinum};
        border-radius: 6px;
    }

    .contd-shop-btn {
        height: 40px;
        margin-top: 10px;
    }
`;

const CartDiscount = ({ coupons, setAppliedCoupon, selectedItems }) => {
    const [couponCode, setCouponCode] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const { productVariants } = useProductVariant();

    // Hàm xử lý khi áp dụng mã giảm giá
    const handleSelectCoupon = (coupon) => {
        setCouponCode(coupon.name);
        setModalOpen(false); // Đóng modal
    };
    const handleApplyCoupon = (e) => {
        e.preventDefault();
        const coupon = coupons.find((coupon) => coupon.name === couponCode.trim());

        // Kiểm tra mã giảm giá hợp lệ
        if (!coupon) {
            toast.error("Mã giảm giá không hợp lệ!");
            return;
        }

        if (selectedItems.length === 0) {
            toast.warn("Vui lòng chọn ít nhất 1 sản phẩm để sử dụng mã giảm giá!");
            return;
        }

        // Lấy ngày hiện tại và chuyển đổi start_date và end_date
        const currentDate = new Date();
        const startDate = new Date(coupon.start_date);
        const endDate = new Date(coupon.end_date);

        if (currentDate < startDate) {
            toast.error("Mã giảm giá chưa được áp dụng!");
            return;
        }

        if (currentDate > endDate) {
            toast.error("Mã giảm giá đã hết hạn!");
            return;
        }

        if (!coupon.is_active) {
            toast.error("Mã giảm giá này hiện không khả dụng!");
            return;
        }

        if (coupon.deleted_at) {
            toast.error("Mã giảm giá không tồn tại!");
            return;
        }

        let isValid = true;
        selectedItems.forEach((item) => {
            const variant = productVariants.find((pv) => pv.id === item.product_variant_id);
            if (variant && item.quantity > variant.quantity) {
                isValid = false;
                toast.error(
                    `Sản phẩm "${item.product_name}" chỉ còn ${variant.quantity} sản phẩm, vui lòng giảm số lượng.`
                );
            }
        });

        if (!isValid) return;

        const subTotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

        if (subTotal < coupon.min_order_value || subTotal > coupon.max_order_value) {
            toast.warn(
                `Số tiền của bạn phải trong khoảng ${formatCurrency(coupon.min_order_value)} - ${formatCurrency(
                    coupon.max_order_value
                )} để sử dụng mã giảm giá.`
            );
            return;
        }

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
            <BaseLinkOutlinePlatinum onClick={() => setModalOpen(true)} className="contd-shop-btn w-full text-gray">
                Chọn voucher
            </BaseLinkOutlinePlatinum>
            {isModalOpen && (
                <ModalVoucher
                    coupons={coupons}
                    onClose={() => setModalOpen(false)}
                    onSelectCoupon={handleSelectCoupon}
                />
            )}
            <BaseLinkOutlinePlatinum as={BaseLinkOutlinePlatinum} to="/" className="contd-shop-btn w-full text-gray">
                Tiếp tục mua hàng
            </BaseLinkOutlinePlatinum>
        </CartDiscountWrapper>
    );
};

CartDiscount.propTypes = {
    coupons: PropTypes.array.isRequired,
    setAppliedCoupon: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            product_id: PropTypes.number,
            product_variant_id: PropTypes.number,
            price: PropTypes.number,
            quantity: PropTypes.number,
        })
    ).isRequired,
};

export default CartDiscount;
