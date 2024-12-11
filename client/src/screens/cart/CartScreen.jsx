import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { breakpoints } from "../../styles/themes/default";
import CartTable from "../../components/cart/CartTable";
import CartDiscount from "../../components/cart/CartDiscount";
import CartSummary from "../../components/cart/CartSummary";
import { useColors, useSizes } from "../../hooks/useAtribute";
import useCoupons from "../../hooks/useCoupons";
import useCart from "../../hooks/useCart";
import Loader from "../../components/loader/loader";

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
    const [selectedItems, setSelectedItems] = useState([]);
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const { colors } = useColors();
    const { sizes } = useSizes();
    const { carts, updateCart, isLoading } = useCart(user?.id);
    const { coupons } = useCoupons();
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    console.log(carts);
    
    //     if (user) {
    //         // Khi có user, lấy giỏ hàng từ API
    //         setCartItems(carts.cart || []);
    //     } else {
    //         // Nếu không có user, lấy giỏ hàng từ localStorage
    //         const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    //         setCartItems(storedCart);
    //     }
    // };
    // useEffect(() => {
    //     // Chỉ gọi `fetchCartItems` khi có sự thay đổi về `user` (lần đầu tiên) hoặc khi chưa có giỏ hàng

    //     fetchCartItems();
    // }, [user, carts]); // Chạy lại khi `user` hoặc `carts` thay đổi

    useEffect(() => {
        if (carts?.cart) {
            setCartItems(carts.cart);
        }
    }, [carts]);

    // Sử dụng useRef để lưu trữ timeout
    // const debounceRef = useRef(null);

    const handleIncreaseQuantity = (cartId, size, color, productVariantId, quantity) => {
        // Cập nhật số lượng bằng cách sử dụng callback để lấy giá trị quantity hiện tại
        const updatedQuantity = quantity + 1;

        // Cập nhật ngay lập tức số lượng trên UI
        setCartItems((prevItems) => {
            return prevItems.map((item) =>
                item.cartId === cartId &&
                item.size === size &&
                item.color === color &&
                item.productVariantId === productVariantId
                    ? { ...item, quantity: updatedQuantity }
                    : item
            );
        });

        // // Hủy timeout trước đó nếu có
        // clearTimeout(debounceRef.current);

        // // Đợi 500ms sau khi người dùng ngừng thao tác để gọi API
        // debounceRef.current = setTimeout(() => {
        //     updateCart({ cartId, size, color, productVariantId, quantity: updatedQuantity });
        // }, 500);
        updateCart({ cartId, size, color, productVariantId, quantity: updatedQuantity });
    };

    const handleDecreaseQuantity = (cartId, size, color, productVariantId, quantity) => {
        const updatedQuantity = Math.max(quantity - 1, 1);

        // Cập nhật số lượng bằng cách sử dụng callback để lấy giá trị quantity hiện tại
        setCartItems((prevItems) => {
            return prevItems.map((item) =>
                item.cartId === cartId &&
                item.size === size &&
                item.color === color &&
                item.productVariantId === productVariantId
                    ? { ...item, quantity: updatedQuantity }
                    : item
            );
        });

        // // Hủy timeout trước đó nếu có
        // clearTimeout(debounceRef.current);

        // // Đợi 500ms sau khi người dùng ngừng thao tác để gọi API
        // debounceRef.current = setTimeout(() => {
        //     updateCart({ cartId, size, color, productVariantId, quantity: updatedQuantity });
        // }, 500);
        updateCart({ cartId, size, color, productVariantId, quantity: updatedQuantity });
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
    const isLoggedIn = Boolean(localStorage.getItem("userInfo"));
    if (isLoading) {
        return (
            <p>
                <Loader />
            </p>
        );
    }

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
                            colors={colors}
                            sizes={sizes}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                    <div className="grid cart-content-right">
                        <CartDiscount
                            coupons={coupons}
                            setAppliedCoupon={setAppliedCoupon}
                            selectedItems={selectedItems}
                        />
                        <CartSummary
                            appliedCoupon={appliedCoupon}
                            selectedItems={selectedItems}
                            cartItems={cartItems}
                        />
                    </div>
                </CartContent>
            </Container>
        </CartPageWrapper>
    );
};

export default CartScreen;
