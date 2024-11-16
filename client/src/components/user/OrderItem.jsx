import styled from "styled-components";
import PropTypes from "prop-types";
import { currencyFormat } from "../../utils/helper";
import { BaseLinkGreen } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import useOrder from "../../hooks/useOrder";
import useProductVariant from "../../hooks/useProductVariant";
import { useColors, useSizes } from "../../hooks/useAtribute";
import useProduct from "../../hooks/useProduct";

const OrderItemWrapper = styled.div`
    margin: 30px 0;
    border-bottom: 1px solid ${defaultTheme.color_anti_flash_white};

    .order-item-title {
        margin-bottom: 12px;
    }

    .order-item-details {
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 24px 32px;
        border-radius: 8px;

        @media (max-width: ${breakpoints.sm}) {
            padding: 20px 24px;
        }

        @media (max-width: ${breakpoints.xs}) {
            padding: 12px 16px;
        }
    }

    .order-info-group {
        @media (max-width: ${breakpoints.sm}) {
            flex-direction: column;
        }
    }

    .order-info-item {
        width: 50%;

        span {
            &:nth-child(2) {
                margin-left: 4px;
            }
        }

        &:nth-child(even) {
            text-align: right;
            @media (max-width: ${breakpoints.lg}) {
                text-align: left;
            }
        }

        @media (max-width: ${breakpoints.sm}) {
            width: 100%;
            margin: 2px 0;
        }
    }

    .order-overview {
        margin: 28px 0;
        gap: 12px;

        @media (max-width: ${breakpoints.lg}) {
            margin: 20px 0;
        }

        @media (max-width: ${breakpoints.sm}) {
            flex-direction: column;
        }

        &-img {
            width: 100px;
            height: 100px;
            border-radius: 6px;
            overflow: hidden;
        }

        &-content {
            grid-template-columns: 100px auto;
            gap: 18px;
        }

        &-info {
            ul {
                span {
                    &:nth-child(2) {
                        margin-left: 4px;
                    }
                }
            }
        }
    }
`;

const OrderItem = ({ order }) => {
    const { productVariants } = useProductVariant();
    const { colors } = useColors();
    const { sizes } = useSizes();
    const { products } = useProduct();

    const nav = useNavigate();
    const { users } = useUser();
    if (!users) {
        // Nếu không có người dùng (chưa đăng nhập), điều hướng đến trang đăng nhập
        return nav("/login");
    }

    return (
        <OrderItemWrapper>
            <div className="order-item-details">
                <h3 className="text-x order-item-title">Order no: {order.id}</h3>
                <div className="order-info-group flex flex-wrap">
                    <div className="order-info-item">
                        <span className="text-gray font-semibold">Order Date:</span>
                        <span className="text-silver">
                            {new Date(order.created_at).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="order-info-item">
                        <span className="text-gray font-semibold">Order Status:</span>
                        <span className="text-silver">{order.status_order}</span>
                    </div>
                    <div className="order-info-item">
                        <span className="text-gray font-semibold">Estimated Delivery Date:</span>
                        <span className="text-silver">{order.updated_at}</span>
                    </div>
                    <div className="order-info-item">
                        <span className="text-gray font-semibold">Method:</span>
                        <span className="text-silver">{order.payment_type}</span>
                    </div>
                </div>
            </div>
            {order.order_items.map((item, itemIndex) => {
                const product = products.find((product) => product.id === item.product_id);
                const productVariant = productVariants.find((variant) => variant.id === item.product_variant_id);
                const colorDetail = colors.find((color) => color.id === productVariant?.color_id);
                const sizeDetail = sizes.find((size) => size.id === productVariant?.size_id);

                return (
                    <div key={itemIndex} className="order-overview flex justify-between">
                        <div className="order-overview-content grid">
                            <div className="order-overview-img">
                                <img src={product?.image_url} alt="" className="object-fit-cover" />
                            </div>
                            <div className="order-overview-info">
                                <h4 className="text-xl">{product?.name}</h4>
                                <ul>
                                    <li className="font-semibold text-base">
                                        <span>Color:</span>
                                        <span className="text-silver">{colorDetail?.name || "Không có color"}</span>
                                    </li>
                                    <li className="font-semibold text-base">
                                        <span>Size:</span>
                                        <span className="text-silver">{sizeDetail?.name || "Không có size"}</span>
                                    </li>
                                    <li className="font-semibold text-base">
                                        <span>Quantity:</span>
                                        <span className="text-silver">{item?.quantity}</span>
                                    </li>
                                    <li className="font-semibold text-base">
                                        <span>Total:</span>
                                        <span className="text-silver">
                                            {currencyFormat(productVariant?.price || product?.sale_price)}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <BaseLinkGreen to="/order_detail">View Detail</BaseLinkGreen>
                    </div>
                );
            })}
        </OrderItemWrapper>
    );
};

export default OrderItem;

OrderItem.propTypes = {
    order: PropTypes.object,
};
