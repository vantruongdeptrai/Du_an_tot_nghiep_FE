import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import ProductPreview from "../../components/product/ProductPreview";
import ProductDescriptionTab from "../../components/product/ProductDescriptionTab";
import ProductSimilar from "../../components/product/ProductSimilar";

import { breakpoints } from "../../styles/themes/default";
import { defaultTheme } from "../../styles/themes/default";
import apiClient from "../../api/axiosConfig";
import formatCurrency from "../../utils/formatUtils";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/loader/loader";
import { useSizes, useColors } from "../../hooks/useAtribute";
import useProduct from "../../hooks/useProduct";
import useProductVariant from "../../hooks/useProductVariant";
const DetailsScreenWrapper = styled.main`
    margin: 40px 0;
`;

const DetailsContent = styled.div`
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;

    @media (max-width: ${breakpoints.xl}) {
        gap: 24px;
        grid-template-columns: 3fr 2fr;
    }

    @media (max-width: ${breakpoints.lg}) {
        grid-template-columns: 100%;
    }
`;

const ProductDetailsWrapper = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 24px;
    height: 500px;

    @media (max-width: ${breakpoints.sm}) {
        padding: 16px;
    }

    @media (max-width: ${breakpoints.xs}) {
        padding: 12px;
    }

    .prod-title {
        margin-bottom: 10px;
    }
    .rating-and-comments {
        column-gap: 16px;
        margin-bottom: 20px;
    }
    .prod-rating {
        column-gap: 10px;
    }
    .prod-comments {
        column-gap: 10px;
    }
    .prod-add-btn {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 1px solid;
        min-width: 70px;
        column-gap: 8px;
        background-color: ${defaultTheme.color_sea_green};
        color: ${defaultTheme.color_white};
        border-radius: 5px;
        &-text {
            margin-top: 2px;
        }
        &:hover {
            background-color: #68d8d6; /* Màu sea green sáng hơn */
            border-color: #68d8d6;
            color: #9ceaef; /* Màu chữ khi hover */
        }
    }

    prod-quantity {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 1px solid;
        min-width: 70px;
        column-gap: 8px;
        background-color: ${defaultTheme.color_sea_green};
        color: ${defaultTheme.color_white};
        border-radius: 5px;
    }

    .btn-and-price {
        margin-top: 36px;
        column-gap: 16px;
        row-gap: 10px;

        @media (max-width: ${breakpoints.sm}) {
            margin-top: 24px;
        }
    }
`;

const ProductSizeWrapper = styled.div`
    .prod-size-top {
        gap: 20px;
    }
    .prod-size-list {
        gap: 12px;
        margin-top: 16px;
        @media (max-width: ${breakpoints.sm}) {
            gap: 8px;
        }
    }

    .prod-size-item {
        position: relative;
        height: 38px;
        width: 38px;
        cursor: pointer;

        @media (max-width: ${breakpoints.sm}) {
            width: 32px;
            height: 32px;
        }

        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 38px;
            height: 38px;
            opacity: 0;
            cursor: pointer;

            @media (max-width: ${breakpoints.sm}) {
                width: 32px;
                height: 32px;
            }

            &:checked + span {
                color: ${defaultTheme.color_white};
                background-color: ${defaultTheme.color_outerspace};
                border-color: ${defaultTheme.color_outerspace};
            }
        }

        span {
            width: 38px;
            height: 38px;
            border-radius: 8px;
            border: 1.5px solid ${defaultTheme.color_silver};
            text-transform: uppercase;

            @media (max-width: ${breakpoints.sm}) {
                width: 32px;
                height: 32px;
            }
        }
    }
`;

const ProductColorWrapper = styled.div`
    margin-top: 32px;

    @media (max-width: ${breakpoints.sm}) {
        margin-top: 24px;
    }

    .prod-colors-top {
        margin-bottom: 16px;
    }

    .prod-colors-list {
        column-gap: 12px;
    }

    .prod-colors-item {
        position: relative;
        width: 22px;
        height: 22px;
        transition: ${defaultTheme.default_transition};

        &:hover {
            scale: 0.9;
        }

        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 22px;
            height: 22px;
            opacity: 0;
            cursor: pointer;

            &:checked + span {
                outline: 1px solid ${defaultTheme.color_gray};
                outline-offset: 3px;
            }
        }

        .prod-colorbox {
            border-radius: 100%;
            width: 22px;
            height: 22px;
            display: inline-block;
        }
    }
`;

const IncreaAndDecreaWrapper = styled.div`
    margin-top: 32px;

    @media (max-width: ${breakpoints.sm}) {
        margin-top: 24px;
    }

    .prod-colors-top {
        margin-bottom: 16px;
    }

    .prod-colors-list {
        column-gap: 12px;
    }

    .prod-colors-item {
        position: relative;
        width: 22px;
        height: 22px;
        transition: ${defaultTheme.default_transition};

        &:hover {
            scale: 0.9;
        }

        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 22px;
            height: 22px;
            opacity: 0;
            cursor: pointer;

            &:checked + span {
                outline: 1px solid ${defaultTheme.color_gray};
                outline-offset: 3px;
            }
        }

        .prod-colorbox {
            border-radius: 100%;
            width: 22px;
            height: 22px;
            display: inline-block;
        }
    }
`;

const ProductDetailsScreen = () => {
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const { products } = useProduct();
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [size, setSize] = useState([]);
    const { sizes } = useSizes();

    const [color, setColor] = useState([]);
    const { colors } = useColors();
    const [variants, setVariants] = useState([]);
    const { productVariants } = useProductVariant();
    const [variantPrice, setVariantPrice] = useState(null);
    const [variantStock, setVariantStock] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    console.log(cart);

    const user = JSON.parse(localStorage.getItem("userInfo"));
    const breadcrumbItems = [
        { label: "Trang chủ", link: "/" },
        { label: "Chi tiết sản phẩm", link: "" },
    ];
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = products.find((prod) => prod.id === parseInt(id));
                if (!productData) return; // Nếu không tìm thấy sản phẩm, tránh tiếp tục.

                setProduct(productData);
                setVariantPrice(productData.price);

                const productVariant = productVariants.filter((variant) => variant.product_id === parseInt(id));
                setVariants(productVariant);

                const sizeIds = [...new Set(productVariant.map((v) => v.size_id))];
                const colorIds = [...new Set(productVariant.map((v) => v.color_id))];

                setSize(sizes.filter((size) => sizeIds.includes(size.id)));
                setColor(colors.filter((color) => colorIds.includes(color.id)));

                setLoading(false);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setLoading(false);
            }
        };

        if (id && products.length > 0 && productVariants.length > 0 && sizes.length > 0 && colors.length > 0) {
            fetchProductData();
        }
    }, [id, products, productVariants, sizes, colors]); // Chỉ chạy lại khi id hoặc các dữ liệu liên quan thay đổi.

    useEffect(() => {
        if (selectedSize && selectedColor) {
            // Tìm kiếm biến thể với size và color đã chọn
            const selectedVariant = variants.find(
                (variant) => variant.size_id === selectedSize && variant.color_id === selectedColor
            );
            if (selectedVariant) {
                // Nếu tìm thấy biến thể, cập nhật giá và số lượng
                setVariantPrice(selectedVariant.price);
                setVariantStock(selectedVariant.quantity);
            } else {
                // Nếu không tìm thấy biến thể, đặt lại giá và số lượng về mặc định hoặc giá trị hợp lý
                setVariantPrice(product ? product.price : 0); // Đặt lại giá mặc định nếu không chọn biến thể
                setVariantStock(0); // Không có số lượng nếu không chọn biến thể hợp lệ
            }
        } else {
            // Nếu không chọn size hoặc color, đặt lại giá và số lượng về mặc định
            setVariantPrice(product ? product.price : 0);
            setVariantStock(0);
        }
    }, [selectedSize, selectedColor, variants, product]);
    // const stars = Array.from({ length: 5 }, (_, index) => (
    //     <span
    //         key={index}
    //         className={`text-yellow ${
    //             index < Math.floor(product.rating)
    //                 ? "bi bi-star-fill"
    //                 : index + 0.5 === product.rating
    //                 ? "bi bi-star-half"
    //                 : "bi bi-star"
    //         }`}
    //     ></span>
    // ));
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch("http://127.0.0.1:8000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(data),
            });
            return response.json();
        },
        onSuccess: () => {
            toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
            queryClient.invalidateQueries(["cart"]);
        },
        onError: () => {
            toast.error("Error adding product to cart.");
        },
    });
    const handleAddToCart = async (productId) => {
        // if(!selectedColor && !selectedSize) {
        //     toast.warn("Please select color or size!");
        //     return;
        // }
        const existingProduct = cart.find((item) => item.product_id === productId);

        let finalPrice = product.price; // Default to base price
        let productVariantId = null;

        if (!selectedSize || !selectedColor) {
            toast.warn("Vui lòng chọn đầy đủ kích thước và màu sắc trước khi thêm vào giỏ hàng.");
            return;
        }

        if (selectedSize && selectedColor) {
            const selectedVariant = variants.find(
                (variant) => variant.size_id === selectedSize && variant.color_id === selectedColor
            );
            if (selectedVariant) {
                finalPrice = selectedVariant.price;
                productVariantId = selectedVariant.id;
            }
            if (!selectedVariant || selectedVariant.quantity <= 0) {
                toast.error("Sản phẩm đã hết hàng, không thể thêm vào giỏ.");
                return;
            }
            if (!selectedVariant || selectedVariant.quantity < quantity) {
                toast.error("Số lượng không thể quá số lượng có trong sản phẩm!");
                return;
            }
        }

        let updatedCart = [...cart];
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            if (product && product.id === productId) {
                cart.push({
                    product_id: product.id,
                    name: product.name,
                    image: product.image_url,
                    quantity: quantity,
                    price: finalPrice,
                    size: selectedSize || null,
                    color: selectedColor || null,
                    product_variant_id: productVariantId, // Add variant ID to local cart
                });
            }
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(cart));

        if (!user) {
            const data = await apiClient.post("/cart/add/guest", {
                product_id: productId,
                quantity: quantity,

                product_variant_id: productVariantId,
            });

            console.log(data);

            // localStorage.setItem("session_id", data.data.session_id);
            toast.success("Sản phẩm đã được thêm vào giỏ hàng (local storage).");
            return;
        } else {
            mutation.mutate({
                user_id: user.id,
                product_id: productId,
                quantity: quantity,
                price: finalPrice,
                size: selectedSize || null,
                color: selectedColor || null,
                product_variant_id: productVariantId,
            });
        }
    };
    const handleSizeSelect = (sizeId) => {
        setSelectedSize((prev) => (prev === sizeId ? null : sizeId));
    };

    const handleColorSelect = (colorId) => {
        setSelectedColor((prev) => (prev === colorId ? null : colorId));
    };
    if (loading)
        return (
            <p>
                <Loader></Loader>
            </p>
        );
    return (
        <DetailsScreenWrapper>
            <Container>
                <Breadcrumb items={breadcrumbItems} />
                <DetailsContent className="grid">
                    <ProductPreview previewImagesVariant={variants} previewImages={product?.image_url || []} />
                    <ProductDetailsWrapper>
                        <h2 className="prod-title">{product?.name}</h2>
                        
                        {/* Hiển thị size và màu */}
                        {size.length > 0 && (
                            <ProductSizeWrapper>
                                <div className="prod-size-top flex items-center flex-wrap">
                                    <p className="text-lg font-semibold text-outerspace">Size</p>
                                </div>
                                <div className="prod-size-list flex items-center" style={{ margin: "10px 20px" }}>
                                    {size.map((size, index) => (
                                        <div className="prod-size-item" key={index}>
                                            <input
                                                type="radio"
                                                name="size"
                                                checked={selectedSize === size.id}
                                                onClick={() => handleSizeSelect(size.id)}
                                            />
                                            <span className="flex items-center justify-center font-medium text-outerspace text-sm">
                                                {size.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </ProductSizeWrapper>
                        )}

                        {color.length > 0 && (
                            <ProductColorWrapper>
                                <div className="prod-colors-top flex items-center flex-wrap">
                                    <p className="text-lg font-semibold text-outerspace">Màu sắc</p>
                                </div>
                                <div className="prod-colors-list flex items-center">
                                    {color.map((color, index) => (
                                        <div className="prod-colors-item" style={{ margin: "10px 20px" }} key={index}>
                                            <input
                                                style={{ width: "60px", height: "35px" }}
                                                type="radio"
                                                name="colors"
                                                checked={selectedColor === color.id}
                                                onClick={() => handleColorSelect(color.id)}
                                            />
                                            <span
                                                className=" flex items-center justify-center font-medium text-outerspace text-sm"
                                                style={{
                                                    width: "60px",
                                                    height: "35px",
                                                    fontSize: "16px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    backgroundColor: color.name, // Sử dụng màu từ biến thể
                                                }}
                                            ></span>
                                        </div>
                                    ))}
                                </div>
                            </ProductColorWrapper>
                        )}

                        <IncreaAndDecreaWrapper>
                            <div className="prod-size-top flex items-center flex-wrap">
                                <p className="text-lg font-semibold text-outerspace">Chọn số lượng</p>
                            </div>
                            <div style={{ gap: 10, marginLeft: 20 }} className="flex btn-and-price">
                                <button
                                    style={{ height: 25, fontSize: 25 }}
                                    className="prod-add-btn"
                                    onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                                >
                                    -
                                </button>
                                <span className="prod-add-btn">{quantity}</span>
                                <button
                                    style={{ height: 25, fontSize: 25 }}
                                    className="prod-add-btn"
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </IncreaAndDecreaWrapper>

                        <div className="btn-and-price flex items-center flex-wrap">
                            <button
                                style={{
                                    padding: 10,
                                    fontSize: 16,
                                    opacity: variantStock === 0 ? 0.5 : 1,
                                    cursor: variantStock === 0 ? "not-allowed" : "pointer",
                                }}
                                className="prod-add-btn"
                                onClick={() => handleAddToCart(product.id)}
                                disabled={variantStock === 0}
                            >
                                <div className="prod-add-btn-icon">
                                    <i className={variantStock === 0 ? "bi bi-cart-x" : "bi bi-cart2"}></i>
                                </div>
                                <div className="prod-add-btn-text">
                                    {variantStock === 0 ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}
                                </div>
                            </button>
                            <div style={{}} className="prod-price text-xl font-bold text-outerspace">
                                <div>
                                    Giá tiền: {formatCurrency(variantPrice)}{" "}
                                    {selectedColor && selectedSize && (
                                        <span style={{ opacity: 0.6 }}>
                                            ({variantStock > 0 ? `${variantStock} sản phẩm` : "đã hết hàng"})
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ProductDetailsWrapper>
                </DetailsContent>
                <ProductDescriptionTab product_id={id} user={user} />
                <ProductSimilar product={product} />
            </Container>
        </DetailsScreenWrapper>
    );
};

export default ProductDetailsScreen;
