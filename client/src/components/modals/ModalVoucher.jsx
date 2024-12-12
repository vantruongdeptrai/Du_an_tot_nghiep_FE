import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { BaseButtonOuterspace } from "../../styles/button";
import formatCurrency from "../../utils/formatUtils";
import formatDate from "../../utils/formatDate";

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 500px;
        width: 100%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .modal-footer {
        margin-top: 20px;
        text-align: right;
    }

    .coupon-item {
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

const ModalVoucher = ({ coupons, onClose, onSelectCoupon }) => {
    return (
        <ModalWrapper>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Chọn mã giảm giá</h3>
                    <button style={{fontSize: "16px"}} onClick={onClose}>✖</button>
                </div>
                <div className="modal-body">
                    {coupons.length > 0 ? (
                        coupons.map((coupon) => (
                            <div className="coupon-item" key={coupon.id}>
                                <div>
                                    <strong>{coupon.name}</strong>
                                    <p>{coupon.description || ""} Giảm tối đa {formatCurrency(coupon.max_order_value * (coupon.discount_amount / 100))}</p>
                                    <p>Đơn hàng tối thiểu {formatCurrency(coupon.min_order_value)}</p>
                                    <p>HSD: {formatDate(coupon.end_date)}</p>
                                </div>
                                <BaseButtonOuterspace onClick={() => onSelectCoupon(coupon)}>
                                    Chọn
                                </BaseButtonOuterspace>
                            </div>
                        ))
                    ) : (
                        <p>Không có mã giảm giá nào khả dụng.</p>
                    )}
                </div>
                <div className="modal-footer">
                    <button style={{fontSize: "16px"}} onClick={onClose}>Đóng</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

ModalVoucher.propTypes = {
    coupons: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelectCoupon: PropTypes.func.isRequired,
};

export default ModalVoucher;
