import { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import formatCurrency from "../../utils/formatUtils";
import { BaseLinkGreen } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import useProductVariant from "../../hooks/useProductVariant";
import { useColors, useSizes } from "../../hooks/useAtribute";
import useProduct from "../../hooks/useProduct";
import Modals from "../modals/Modals";
import useOrder from "../../hooks/useOrder";
import ModalComment from "../modals/ModalComment";

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

    .button-rate,
    .button-delete {
        width: 160px;
        border-radius: 5px;
        border: 1px solid;
        height: 40px;
    }
    .button-delete:hover {
        background-color: ${defaultTheme.color_red};
        color: ${defaultTheme.color_white};
        border: none;
    }
    .button-rate:hover {
        background-color: ${defaultTheme.color_sea_green_v1};
        color: ${defaultTheme.color_white};
        border: none;
    }
    
`;

const OrderItem = ({ order, guestOrder }) => {
    const { productVariants } = useProductVariant();
    const { colors } = useColors();
    const { sizes } = useSizes();
    const { products } = useProduct();
    const { deleteOrderReason, handleConfirmOrder } = useOrder();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalCommentOpen, setIsModalCommentOpen] = useState({});
    const [hasReviewed, setHasReviewed] = useState(false);
    const [autoConfirmTimeout, setAutoConfirmTimeout] = useState(null);
    // const nav = useNavigate();
    const users = localStorage.getItem("userInfo");

    // Kiểm tra nếu người dùng đã đăng nhập, sử dụng order, nếu không thì kiểm tra guestOrder
    const currentOrder = users ? order : guestOrder;

    const handleCancelOrder = async (reason) => {
        // Handle the order cancellation logic here
        console.log("Payload gửi lên:", { cancel_reason: reason });
        await deleteOrderReason(order.id, { cancel_reason: reason });
        setIsModalOpen(false); // Close modal after confirmation
    };

    const handleComment = (data, productId) => {
        if (data) {
            setHasReviewed(true); // Set review status to true after comment
        }
        setIsModalCommentOpen((prev) => ({ ...prev, [productId]: false })); // Close the modal for this product
    };

    // const initiateAutoConfirm = () => {
    //     // Nếu trạng thái là "Chờ xác nhận", kích hoạt tự động xác nhận sau 30 giây
    //     if (order.status_order === "Giao hàng thành công") {
    //         const timeoutId = setTimeout(() => {
    //             handleConfirmOrder(order.id, "received");
    //         }, 10000);
    //         setAutoConfirmTimeout(timeoutId);
    //     }
    // };

    // const cancelAutoConfirm = () => {
    //     if (autoConfirmTimeout) {
    //         clearTimeout(autoConfirmTimeout);
    //         setAutoConfirmTimeout(null);
    //     }
    // };
    

    // useEffect(() => {
    //     // Gọi initiateAutoConfirm khi component được render và trạng thái là "Chờ xác nhận"
    //     initiateAutoConfirm();
    //     return () => {
    //         // Cleanup timeout khi component bị unmount
    //         cancelAutoConfirm();
    //     };
    // }, [order.status_order]);

    return (
        <OrderItemWrapper>
            {Array.isArray(currentOrder) ? (
                // Nếu currentOrder là mảng, hiển thị tất cả các đơn hàng trong guestOrder
                currentOrder.map((guestOrderItem, index) => (
                    <div key={index} className="order-item-details">
                        <h3 className="text-x order-item-title">Order no: {guestOrderItem.id}</h3>
                        <div className="order-info-group flex flex-wrap">
                            <div className="order-info-item">
                                <span className="text-gray font-semibold">Order Date:</span>
                                <span className="text-silver">
                                    {new Date(guestOrderItem.created_at).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="order-info-item">
                                <span className="text-gray font-semibold">Order Status:</span>
                                <span className="text-silver">{guestOrderItem.status_order}</span>
                            </div>
                            <div className="order-info-item">
                                <span className="text-gray font-semibold">Estimated Delivery Date:</span>
                                <span className="text-silver">{guestOrderItem.updated_at}</span>
                            </div>
                            <div className="order-info-item">
                                <span className="text-gray font-semibold">Method:</span>
                                <span className="text-silver">{guestOrderItem.payment_type}</span>
                            </div>
                        </div>

                        <div style={{ gap: 30 }} className="flex flex-col">
                            <BaseLinkGreen style={{ fontSize: 18 }} to={`/order_detail/${guestOrderItem.id}`}>
                                View Detail
                            </BaseLinkGreen>
                        </div>
                    </div>
                ))
            ) : (
                // Nếu currentOrder không phải là mảng, hiển thị 1 đơn hàng duy nhất
                <div className="order-item-details">
                    <div
                        style={{ justifyContent: "space-between", alignItems: "center", margin: "15px 0" }}
                        className="flex"
                    >
                        <h3 className="text-x order-item-title">Mã đơn hàng: {currentOrder.id}</h3>

                        {order.status_order === "Chờ xác nhận" ? (
                            <div className="button-delete">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    style={{ fontSize: 16, fontWeight: 500, border: "none" }}
                                    className="button-delete"
                                >
                                    Hủy đơn hàng
                                </button>
                            </div>
                        ) : null}
                        {order.status_order === "Giao hàng thành công" ? (
                            <div className="button-rate">
                                <button
                                    onClick={() => handleConfirmOrder(order.id, "received")}
                                    style={{ fontSize: 16, fontWeight: 500, border: "none" }}
                                    className="button-rate"
                                >
                                    Xác nhận giao hàng
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <div className="order-info-group flex flex-wrap">
                        <div className="order-info-item">
                            <span className="font-semibold">Ngày đặt hàng:</span>
                            <span className="text-silver">
                                {new Date(currentOrder.created_at).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="order-info-item">
                            <span className=" font-semibold">Trạng thái đơn hàng:</span>
                            <span className="text-silver">{currentOrder.status_order}</span>
                        </div>
                        <div className="order-info-item">
                            <span className=" font-semibold">Ngày giao dự kiến:</span>
                            <span className="text-silver">
                                {new Date(currentOrder.updated_at).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="order-info-item">
                            <span className=" font-semibold">Phương thức thanh toán:</span>
                            <span className="text-silver">{currentOrder.payment_type}</span>
                        </div>
                        <div className="order-info-item">
                            <span className=" font-semibold">Tổng tiền đơn hàng:</span>
                            <span className="text-silver">{formatCurrency(currentOrder.total_price)}</span>
                        </div>
                    </div>

                    {currentOrder.order_items.map((item, itemIndex) => {
                        const product = products.find((product) => product.id === item.product_id);
                        const productVariant = productVariants.find(
                            (variant) => variant.id === item.product_variant_id
                        );
                        const colorDetail = colors.find((color) => color.id === productVariant?.color_id);
                        const sizeDetail = sizes.find((size) => size.id === productVariant?.size_id);

                        return (
                            <div key={itemIndex} className="order-overview flex justify-between">
                                <div className="order-overview-content grid">
                                    <div className="order-overview-img">
                                        <img
                                            src={product?.image_url}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                                borderRadius: 5,
                                            }}
                                        />
                                    </div>
                                    <div className="order-overview-info">
                                        <h4 className="text-xl">{product?.name}</h4>
                                        <ul>
                                            <li className="font-semibold text-base">
                                                <span>Màu sắc:</span>
                                                <span className="text-silver">
                                                    {colorDetail?.name || "Không có color"}
                                                </span>
                                            </li>
                                            <li className="font-semibold text-base">
                                                <span>Kích cỡ:</span>
                                                <span className="text-silver">
                                                    {sizeDetail?.name || "Không có size"}
                                                </span>
                                            </li>
                                            <li className="font-semibold text-base">
                                                <span>Số lượng:</span>
                                                <span className="text-silver">{item?.quantity}</span>
                                            </li>
                                            <li className="font-semibold text-base">
                                                <span>Giá:</span>
                                                <span className="text-silver">
                                                    {formatCurrency(productVariant?.price || product?.sale_price)}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {order.status_order === "Đã nhận hàng" && !hasReviewed ? (
                                    <div className="button-rate">
                                        <button
                                            onClick={() =>
                                                setIsModalCommentOpen((prev) => ({
                                                    ...prev,
                                                    [product.id]: true, // Open modal for this specific product
                                                }))
                                            }
                                            style={{ fontSize: 16, fontWeight: 500, border: "none" }}
                                            className="button-rate"
                                        >
                                            Đánh giá
                                        </button>
                                    </div>
                                ) : hasReviewed ? (
                                    <div className="button-rate">
                                        <button
                                            style={{ fontSize: 16, fontWeight: 500, border: "none" }}
                                            className="button-rate"
                                            disabled
                                        >
                                            Đã đánh giá
                                        </button>
                                    </div>
                                ) : null}
                                <ModalComment
                                    onConfirm={(data) => handleComment(data, product.id)}
                                    product={product}
                                    isOpen={isModalCommentOpen[product?.id] || false} // Check if modal is open for this product
                                    onClose={
                                        () => setIsModalCommentOpen((prev) => ({ ...prev, [product.id]: false })) // Close modal for this product
                                    }
                                />
                            </div>
                        );
                    })}
                    <div style={{ gap: 30 }} className="flex flex-col">
                        <BaseLinkGreen style={{ fontSize: 18 }} to={`/order_detail/${currentOrder.id}`}>
                            Xem chi tiết
                        </BaseLinkGreen>
                    </div>
                    {/* Kiểm tra nếu trạng thái là "Đã hủy" thì hiển thị nút Xóa */}

                    {/* Modal xác nhận xóa */}
                    <Modals
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)} // Đóng modal khi nhấn Cancel
                        onConfirm={handleCancelOrder} // Hành động xóa đơn hàng khi nhấn Confirm
                    />
                </div>
                
            )}
        </OrderItemWrapper>
    );
};

export default OrderItem;

OrderItem.propTypes = {
    order: PropTypes.object,
    guestOrder: PropTypes.array,
};
