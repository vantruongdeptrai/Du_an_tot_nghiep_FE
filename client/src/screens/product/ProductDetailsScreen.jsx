import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import ProductPreview from "../../components/product/ProductPreview";
import { Link } from "react-router-dom";
import { currencyFormat } from "../../utils/helper";
import ProductDescriptionTab from "../../components/product/ProductDescriptionTab";
import ProductSimilar from "../../components/product/ProductSimilar";
import ProductServices from "../../components/product/ProductServices";
import { breakpoints } from "../../styles/themes/default";
import { defaultTheme } from "../../styles/themes/default";
import apiClient from "../../api/axiosConfig";
import Cookies from "js-cookie";
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
        min-width: 80px;
        column-gap: 8px;
        border-radius: 5px;
        &-text {
            margin-top: 2px;
        }
        &:hover {
            background-color: ${defaultTheme.color_sea_green}; /* Màu nền khi hover (ví dụ màu xanh dương) */
            border-color: ${defaultTheme.color_sea_green}; /* Màu viền khi hover */
            color: ${defaultTheme.color_white}; /* Màu chữ khi hover */
        }
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

const ProductDetailsScreen = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [variants, setVariants] = useState([]);
    const [variantPrice, setVariantPrice] = useState(null);
    const breadcrumbItems = [
        { label: "Shop", link: "" },
        { label: "Women", link: "" },
        { label: "Top", link: "" },
    ];
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // Lấy thông tin sản phẩm
                const productResponse = await axios.get("http://127.0.0.1:8000/api/products");
                const productData = productResponse.data.find((prod) => prod.id === parseInt(id));
                setProduct(productData);
                setVariantPrice(productData ? productData.price : null);

                // Lấy thông tin biến thể của sản phẩm
                const variantsResponse = await axios.get("http://127.0.0.1:8000/api/product-variants");
                const productVariants = variantsResponse.data.filter((variant) => variant.product_id === parseInt(id));
                setVariants(productVariants);

                // Nếu sản phẩm có biến thể, lấy màu và kích thước
                if (productVariants.length > 0) {
                    const sizeIds = [...new Set(productVariants.map((v) => v.size_id))];
                    const colorIds = [...new Set(productVariants.map((v) => v.color_id))];

                    // Gọi API để lấy thông tin size và color
                    const sizesResponse = await axios.get("http://127.0.0.1:8000/api/sizes");
                    const colorsResponse = await axios.get("http://127.0.0.1:8000/api/colors");

                    setSizes(sizesResponse.data.filter((size) => sizeIds.includes(size.id)));
                    setColors(colorsResponse.data.filter((color) => colorIds.includes(color.id)));
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    useEffect(() => {
        if (selectedSize && selectedColor) {
            const selectedVariant = variants.find(
                (variant) => variant.size_id === selectedSize && variant.color_id === selectedColor
            );
            if (selectedVariant) {
                setVariantPrice(selectedVariant.price);
            }
        } else if (product) {
            setVariantPrice(product.price);
        }
    }, [selectedSize, selectedColor, variants, product]);

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found</p>;
    const stars = Array.from({ length: 5 }, (_, index) => (
        <span
            key={index}
            className={`text-yellow ${
                index < Math.floor(product.rating)
                    ? "bi bi-star-fill"
                    : index + 0.5 === product.rating
                    ? "bi bi-star-half"
                    : "bi bi-star"
            }`}
        ></span>
    ));
    const handleAddToCart = async (productId) => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find((item) => item.product_id === productId);

        let finalPrice = product.price; // Default to base price
        let productVariantId = null;

        if (selectedSize && selectedColor) {
            const selectedVariant = variants.find(
                (variant) => variant.size_id === selectedSize && variant.color_id === selectedColor
            );
            if (selectedVariant) {
                finalPrice = selectedVariant.price;
                productVariantId = selectedVariant.id; // Capture product_variant_id
            }
        }

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            if (product && product.id === productId) {
                cart.push({
                    product_id: product.id,
                    name: product.name,
                    image: product.image_url,
                    price: finalPrice,
                    quantity: 1,
                    size: selectedSize || null,
                    color: selectedColor || null,
                    product_variant_id: productVariantId, // Add variant ID to local cart
                });
            }
        }

        if (!user) {
            localStorage.setItem("cart", JSON.stringify(cart));
            const data = await apiClient.post(
                "/cart/add/guest",
                {
                    product_id: productId,
                    quantity: existingProduct ? existingProduct.quantity : 1,
                    price: finalPrice,
                    size: selectedSize || null,
                    color: selectedColor || null,
                    product_variant_id: productVariantId,
                },
                { withCredentials: true }
            );
            // localStorage.setItem("session_id", data.data.session_id);
            const session_id = Cookies.get("laravel_session");
            console.log(session_id);

            // alert("Sản phẩm đã được thêm vào giỏ hàng (local storage)!");
        } else {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/cart/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        product_id: productId,
                        quantity: existingProduct ? existingProduct.quantity : 1,
                        price: finalPrice,
                        size: selectedSize || null,
                        color: selectedColor || null,
                        product_variant_id: productVariantId, // Send variant ID to server
                    }),
                });

                if (response.ok) {
                    alert("Sản phẩm đã được thêm vào giỏ hàng (database)!");
                } else {
                    alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
                }
            } catch (error) {
                console.error("Lỗi khi gửi giỏ hàng lên server:", error);
                alert("Lỗi kết nối đến server.");
            }
        }
    };

    return (
        <DetailsScreenWrapper>
            <Container>
                <Breadcrumb items={breadcrumbItems} />
                <DetailsContent className="grid">
                    <ProductPreview previewImagesVariant={variants} previewImages={product.image_url || []} />
                    <ProductDetailsWrapper>
                        <h2 className="prod-title">{product.name}</h2>
                        <div className="flex items-center rating-and-comments flex-wrap">
                            <div className="prod-rating flex items-center">
                                {stars}
                                <span className="text-gray text-xs">{product.rating}</span>
                            </div>
                            <div className="prod-comments flex items-start">
                                <span className="prod-comment-icon text-gray">
                                    <i className="bi bi-chat-left-text"></i>
                                </span>
                                <span className="prod-comment-text text-sm text-gray">
                                    {product.comments_count} comment(s)
                                </span>
                            </div>
                        </div>

                        {/* Hiển thị size và màu */}
                        {sizes.length > 0 && (
                            <ProductSizeWrapper>
                                <div className="prod-size-top flex items-center flex-wrap">
                                    <p className="text-lg font-semibold text-outerspace">Select size</p>
                                </div>
                                <div className="prod-size-list flex items-center">
                                    {sizes.map((size, index) => (
                                        <div className="prod-size-item" key={index}>
                                            <input
                                                type="radio"
                                                name="size"
                                                checked={selectedSize === size.id}
                                                onChange={() =>
                                                    setSelectedSize((prev) => (prev === size.id ? null : size.id))
                                                }
                                            />
                                            <span className="flex items-center justify-center font-medium text-outerspace text-sm">
                                                {size.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </ProductSizeWrapper>
                        )}

                        {colors.length > 0 && (
                            <ProductColorWrapper>
                                <div className="prod-colors-top flex items-center flex-wrap">
                                    <p className="text-lg font-semibold text-outerspace">Colours Available</p>
                                </div>
                                <div className="prod-colors-list flex items-center">
                                    {colors.map((color, index) => (
                                        <div className="prod-colors-item" style={{ margin: 20 }} key={index}>
                                            <input
                                                style={{ width: "60px", height: "35px" }}
                                                type="radio"
                                                name="colors"
                                                checked={selectedColor === color.id}
                                                onChange={() =>
                                                    setSelectedColor((prev) => (prev === color.id ? null : color.id))
                                                }
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
                                            >
                                                {color.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </ProductColorWrapper>
                        )}

                        <div className="btn-and-price flex items-center flex-wrap">
                            <button
                                style={{ padding: 10, fontSize: 16 }}
                                className="prod-add-btn"
                                onClick={() => handleAddToCart(product.id)}
                            >
                                <div className="prod-add-btn-icon">
                                    <i className="bi bi-cart2"></i>
                                </div>
                                <div className="prod-add-btn-text">Add to cart</div>
                            </button>
                            <div style={{}} className="prod-price text-xl font-bold text-outerspace">
                                <div>Price: {currencyFormat(variantPrice)}</div>
                            </div>
                        </div>
                        <ProductServices />
                    </ProductDetailsWrapper>
                </DetailsContent>
                <ProductDescriptionTab />
                <ProductSimilar />
            </Container>
        </DetailsScreenWrapper>
    );
};

export default ProductDetailsScreen;
