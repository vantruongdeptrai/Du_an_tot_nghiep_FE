import React, { useState } from "react";
import styled from "styled-components";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { toast } from "react-toastify";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  .modal-content {
    background-color: ${defaultTheme.color_white};
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    height: 300px;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 30px;

    @media (max-width: ${breakpoints.sm}) {
      width: 90%;
    }

    .modal-header {
      font-size: 20px;
      margin-bottom: 16px;
      text-align: center;
    }

    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 10px 0;
    }

    .modal-footer {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .cancel-btn {
      background-color: ${defaultTheme.color_gray};
      color: ${defaultTheme.color_white};
      font-size: 16px;
      font-weight: 500;
    }

    .cancel-btn:hover{
      opacity: 0.7;
    }

    .confirm-btn:hover{
      opacity: 0.7;
    }

    .confirm-btn {
      background-color: ${defaultTheme.color_red};
      color: ${defaultTheme.color_white};
      font-size: 16px;
      font-weight: 500;
    }
  }
`;

const Modals = ({ isOpen, onClose, onConfirm }) => {
  const [cancelReason, setCancelReason] = useState("");

  const handleCancel = () => {
    setCancelReason(""); // Reset the reason when modal is closed
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(cancelReason);
    toast.success("Hủy đơn hàng thành công.");
    setCancelReason(""); // Reset the reason after confirming
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="modal-content">
        <div className="modal-header">Chọn lý do hủy đơn hàng</div>
        <div className="modal-body">
          <select
            style={{padding: 10, borderRadius: 5, fontSize: 16}}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            required
          >
            <option value="">Chọn lý do</option>
            <option value="Người mua thay đổi ý định">Người mua thay đổi ý định</option>
            <option value="Đặt nhầm sản phẩm">Đặt nhầm sản phẩm</option>
            <option value="Thời gian giao hàng không phù hợp">Thời gian giao hàng không phù hợp</option>
            <option value="Không liên lạc được với cửa hàng">Không liên lạc được với cửa hàng</option>
          </select>
        </div>
        <div className="modal-footer">
          <button className="confirm-btn" onClick={handleConfirm} disabled={!cancelReason}>
            Xác nhận
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Hủy
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default Modals;