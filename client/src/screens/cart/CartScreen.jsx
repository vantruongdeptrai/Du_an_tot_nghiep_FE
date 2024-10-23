import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { breakpoints } from "../../styles/themes/default";
import CartTable from "../../components/cart/CartTable";
import CartDiscount from "../../components/cart/CartDiscount";
import CartSummary from "../../components/cart/CartSummary";

const CartPageWrapper = styled.main`
  padding: 48px 0;

  .breadcrumb-nav {
    margin-bottom: 20px;
  }
`;

const CartContent = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;

  @media (max-width: ${breakpoints.xl}) {
    grid-template-columns: 100%;
  }

  @media (max-width: ${breakpoints.sm}) {
    margin-top: 24px;
  }

  .cart-list {
    @media (max-width: ${breakpoints.lg}) {
      overflow-x: scroll;
    }
  }

  .cart-content-right {
    gap: 24px;

    @media (max-width: ${breakpoints.xl}) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${breakpoints.md}) {
      grid-template-columns: 100%;
    }
  }
`;

const CartScreen = () => {
  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Cart", link: "" },
  ];

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user) {
        // Nếu chưa đăng nhập, lấy giỏ hàng từ localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
      } else {
        // Nếu đã đăng nhập, gọi API để lấy giỏ hàng theo user_id
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/cart/auth?user_id=${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (response.ok) {
            const cartData = await response.json();
            console.log(cartData.cart);
            
            setCartItems(cartData.cart || []); // Giả định API trả về một mảng `items`
          } else {
            console.error("Failed to fetch cart from server.");
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCartItems();
  }, []);

  return (
    <CartPageWrapper>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <CartContent className="grid items-start">
          <div className="cart-content-left">
            <CartTable cartItems={cartItems} setCartItems={setCartItems} />
          </div>
          <div className="grid cart-content-right">
            <CartDiscount />
            <CartSummary />
          </div>
        </CartContent>
      </Container>
    </CartPageWrapper>
  );
};

export default CartScreen;
