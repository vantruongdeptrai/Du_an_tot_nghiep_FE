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
    const [selectedItems, setSelectedItems] = useState([]); // State để lưu các sản phẩm đã chọn

    useEffect(() => {
        const fetchCartItems = async () => {
            const user = JSON.parse(localStorage.getItem("userInfo"));
            if (!user) {
                const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
                setCartItems(storedCart);
            } else {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/cart/auth?user_id=${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    if (response.ok) {
                        const cartData = await response.json();

                        setCartItems(cartData.cart || []);
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

    // Hàm tăng số lượng sản phẩm
    const handleIncreaseQuantity = (productId, size, color) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product_id === productId && item.size === size && item.color === color
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Hàm giảm số lượng sản phẩm
    const handleDecreaseQuantity = (productId, size, color) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product_id === productId && item.size === size && item.color === color
                    ? { ...item, quantity: Math.max(item.quantity - 1, 1) } // Giảm xuống ít nhất là 1
                    : item
            )
        );
    };

    // Hàm xử lý chọn hoặc bỏ chọn từng sản phẩm
    const handleSelectItem = (item) => {
        setSelectedItems((prev) => {
            const isSelected = prev.find(
                (i) => i.product_id === item.product_id && i.size === item.size && i.color === item.color
            );

            if (isSelected) {
                return prev.filter(
                    (i) => i.product_id !== item.product_id || i.size !== item.size || i.color !== item.color
                );
            } else {
                return [...prev, item];
            }
        });
    };

    return (
        <CartPageWrapper>
            <Container>
                <Breadcrumb items={breadcrumbItems} />
                <CartContent className="grid items-start">
                    <div className="cart-content-left">
                        <CartTable
                            cartItems={cartItems}
                            setCartItems={setCartItems}
                            selectedItems={selectedItems}
                            onSelectItem={handleSelectItem}
                            handleIncreaseQuantity={handleIncreaseQuantity}
                            handleDecreaseQuantity={handleDecreaseQuantity}
                        />
                    </div>
                    <div className="grid cart-content-right">
                        <CartDiscount />
                        <CartSummary selectedItems={selectedItems} cartItems={cartItems} />
                    </div>
                </CartContent>
            </Container>
        </CartPageWrapper>
    );
};

export default CartScreen;
