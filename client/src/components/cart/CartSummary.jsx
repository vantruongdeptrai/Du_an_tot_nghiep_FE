import styled from "styled-components";
import { BaseButtonGreen } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const CartSummaryWrapper = styled.div`
  background-color: ${defaultTheme.color_flash_white};
  padding: 16px;

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
const SHIPPING_FEE = 5.0;

const CartSummary = ({ selectedItems }) => {
  const navigate = useNavigate();
  // Tính tổng tiền cho các sản phẩm đã chọn
  const subtotal = selectedItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  // Hàm xử lý khi người dùng nhấn nút "Proceed To CheckOut"
  const handleProceedToCheckout = () => {
    const orderItems = selectedItems.map((item) => ({
      product_id: item.product_id,
      product_variant_id: item.product_variant_id,
      price: item.price,
      quantity: item.quantity,
    }));
    console.log(orderItems);
    
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    navigate("/checkout");
  };
  
  // Tính tổng cuối cùng
  const grandTotal = subtotal + SHIPPING_FEE;

  return (
    <CartSummaryWrapper>
      <ul className="summary-list">
        <li className="summary-item flex justify-between">
          <span className="font-medium text-outerspace">Sub Total</span>
          <span className="font-medium text-outerspace">
            ${subtotal.toFixed(2)}
          </span>
        </li>
        <li className="summary-item flex justify-between">
          <span className="font-medium text-outerspace">Shipping</span>
          <span className="font-medium text-outerspace">
            ${SHIPPING_FEE.toFixed(2)}
          </span>
        </li>
        <li className="summary-item flex justify-between">
          <span className="font-medium text-outerspace">Grand Total</span>
          <span className="summary-item-value font-bold text-outerspace">
            ${grandTotal.toFixed(2)}
          </span>
        </li>
      </ul>
      <BaseButtonGreen type="submit" className="checkout-btn" onClick={handleProceedToCheckout}>
        Proceed To CheckOut
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
};

export default CartSummary;
