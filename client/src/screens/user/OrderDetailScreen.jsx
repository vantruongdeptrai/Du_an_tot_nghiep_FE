import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import { Link, useParams } from "react-router-dom";
import Title from "../../components/common/Title";
import { orderData } from "../../data/data";
import { currencyFormat } from "../../utils/helper";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import useOrder from "../../hooks/useOrder";
import useUser from "../../hooks/useUser";
import useProductVariant from "../../hooks/useProductVariant";
import { useColors, useSizes } from "../../hooks/useAtribute";
import useProduct from "../../hooks/useProduct";
import formatCurrency from "../../utils/formatUtils";

const OrderDetailScreenWrapper = styled.main`
    .btn-and-title-wrapper {
        margin-bottom: 24px;
        .title {
            margin-bottom: 0;
        }

        .btn-go-back {
            margin-right: 12px;
            transition: ${defaultTheme.default_transition};

            &:hover {
                margin-right: 16px;
            }
        }
    }

    .order-d-top {
        background-color: ${defaultTheme.color_whitesmoke};
        padding: 26px 32px;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.05);

        @media (max-width: ${breakpoints.sm}) {
            flex-direction: column;
            row-gap: 12px;
        }
    }
`;

const OrderDetailStatusWrapper = styled.div`
    margin: 0 36px;
    @media (max-width: ${breakpoints.sm}) {
        margin: 0 10px;
        overflow-x: scroll;
    }

    .order-status {
        height: 4px;
        margin: 50px 0;
        max-width: 580px;
        width: 500px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        margin-bottom: 70px;

        @media (max-width: ${breakpoints.sm}) {
            margin-right: 40px;
            margin-left: 40px;
        }

        &-dot {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);

            &:nth-child(1) {
                left: 0;
            }

            &:nth-child(2) {
                left: calc(33.3333% - 10px);
            }

            &:nth-child(3) {
                left: calc(66.6666% - 10px);
            }
            &:nth-child(4) {
                right: 0;
            }

            &.status-done {
                background-color: ${defaultTheme.color_outerspace};
                .order-status-text {
                    color: ${defaultTheme.color_outerspace};
                }
            }

            &.status-current {
                position: absolute;
                &::after {
                    content: "";
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background-color: ${defaultTheme.color_outerspace};
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 30;
                    border-radius: 50%;
                }

                .order-status-text {
                    color: ${defaultTheme.color_outerspace};
                }
            }
        }

        &-text {
            position: absolute;
            top: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
        }
    }
`;

const OrderDetailMessageWrapper = styled.div`
    background-color: ${defaultTheme.color_whitesmoke};
    max-width: 748px;
    margin-right: auto;
    margin-left: auto;
    min-height: 68px;
    padding: 16px 24px;
    border-radius: 8px;
    position: relative;
    margin-top: 80px;

    &::after {
        content: "";
        position: absolute;
        top: -34px;
        left: 20%;
        border-bottom: 22px solid ${defaultTheme.color_whitesmoke};
        border-top: 18px solid transparent;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
    }

    @media (max-width: ${breakpoints.sm}) {
        margin-top: 10px;
    }
`;

const OrderDetailListWrapper = styled.div`
    padding: 24px;
    margin-top: 40px;
    border: 1px solid rgba(0, 0, 0, 0.05);

    @media (max-width: ${defaultTheme.md}) {
        padding: 18px;
    }

    @media (max-width: ${defaultTheme.md}) {
        padding: 12px;
    }

    .order-d-item {
        grid-template-columns: 80px 1fr 1fr 32px;
        gap: 20px;
        padding: 12px 0;
        border-bottom: 1px solid ${defaultTheme.color_whitesmoke};
        position: relative;

        @media (max-width: ${defaultTheme.xl}) {
            grid-template-columns: 80px 3fr 2fr 32px;
            padding: 16px 0;
            gap: 16px;
        }

        @media (max-width: ${defaultTheme.sm}) {
            grid-template-columns: 50px 3fr 2fr;
            gap: 16px;
        }

        @media (max-width: ${defaultTheme.xs}) {
            grid-template-columns: 100%;
            gap: 12px;
        }

        &:first-child {
            padding-top: 0;
        }

        &:last-child {
            padding-bottom: 0;
            border-bottom: 0;
        }

        &-img {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

            @media (max-width: ${breakpoints.sm}) {
                width: 50px;
                height: 50px;
            }

            @media (max-width: ${breakpoints.sm}) {
                width: 100%;
                height: 100%;
            }
        }

        &-calc {
            p {
                display: inline-block;
                margin-right: 50px;

                @media (max-width: ${defaultTheme.lg}) {
                    margin-right: 20px;
                }
            }
        }

        &-btn {
            margin-bottom: auto;
            &:hover {
                color: ${defaultTheme.color_sea_green};
            }

            @media (max-width: ${breakpoints.sm}) {
                position: absolute;
                right: 0;
                top: 10px;
            }

            @media (max-width: ${defaultTheme.xs}) {
                width: 28px;
                height: 28px;
                z-index: 5;
                background-color: ${defaultTheme.color_white};
                border-radius: 50%;
                right: 8px;
                top: 24px;
            }
        }
    }
`;

const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Order", link: "/order" },
    { label: "Order Details", link: "/order_detail" },
];

const OrderDetailScreen = () => {
    const { id } = useParams();
    const { productVariants } = useProductVariant();
    const { colors } = useColors();
    const { sizes } = useSizes();
    const { products } = useProduct();
    const { orders } = useOrder();
    const { users } = useUser();
    const userOrder = orders.filter((order) => order.user_id == users.id);
    const orderDetail = userOrder.find((order) => order.id == id);
    console.log(orderDetail);
    if (!orderDetail) return <p>Không có đơn hàng nào</p>;

    return (
        <OrderDetailScreenWrapper className="page-py-spacing">
            <Container>
                <Breadcrumb items={breadcrumbItems} />
                <UserDashboardWrapper>
                    <UserMenu />
                    <UserContent>
                        <div className="flex items-center justify-start btn-and-title-wrapper">
                            <Link to="/order" className="btn-go-back inline-flex items-center justify-center text-xxl">
                                <i className="bi bi-chevron-left"></i>
                            </Link>
                            <Title titleText={"Order Details"} />
                        </div>

                        <div className="order-d-wrapper">
                            <div className="order-d-top flex justify-between items-start">
                                <div className="order-d-top-l">
                                    <h4 className="text-3xl order-d-no">Order no: {orderDetail.id}</h4>
                                    <p className="text-lg font-medium text-gray">{orderDetail.created_at}</p>
                                </div>
                                <div className="order-d-top-r text-xxl text-gray font-semibold">
                                    Total: <span className="text-outerspace">{formatCurrency(orderDetail.total_price)}</span>
                                </div>
                            </div>

                            <OrderDetailStatusWrapper className="order-d-status">
                                <div className="order-status bg-silver">
                                    {/* Trạng thái "Chờ xác nhận" */}
                                    <div
                                        className={`order-status-dot ${
                                            orderDetail.status_order === "Chờ xác nhận" ||
                                            orderDetail.status_order === "Đã xác nhận" ||
                                            orderDetail.status_order === "Đang vận chuyển" ||
                                            orderDetail.status_order === "Giao thành công"
                                                ? "status-done"
                                                : ""
                                        } bg-silver`}
                                    >
                                        <span className="order-status-text font-semibold text-center no-wrap text-silver">
                                            Chờ xác nhận
                                        </span>
                                    </div>

                                    {/* Trạng thái "Đã xác nhận" */}
                                    <div
                                        className={`order-status-dot ${
                                            orderDetail.status_order === "Đã xác nhận" ||
                                            orderDetail.status_order === "Đang vận chuyển" ||
                                            orderDetail.status_order === "Giao thành công"
                                                ? "status-done"
                                                : ""
                                        } bg-silver`}
                                    >
                                        <span className="order-status-text font-semibold text-center no-wrap text-silver">
                                            Đã xác nhận
                                        </span>
                                    </div>

                                    {/* Trạng thái "Đang vận chuyển" */}
                                    <div
                                        className={`order-status-dot ${
                                            orderDetail.status_order === "Đang vận chuyển" ||
                                            orderDetail.status_order === "Giao thành công"
                                                ? "status-done"
                                                : ""
                                        } bg-silver`}
                                    >
                                        <span className="order-status-text font-semibold text-center no-wrap text-silver">
                                            Đang vận chuyển
                                        </span>
                                    </div>

                                    {/* Trạng thái "Giao thành công" */}
                                    <div
                                        className={`order-status-dot ${
                                            orderDetail.status_order === "Giao thành công" ? "status-done" : ""
                                        } bg-silver`}
                                    >
                                        <span className="order-status-text font-semibold text-center no-wrap text-silver">
                                            Giao thành công
                                        </span>
                                    </div>
                                </div>
                            </OrderDetailStatusWrapper>

                            <OrderDetailMessageWrapper className="order-message flex items-center justify-start">
                                <p className="font-semibold text-gray">
                                    8 June 2023 3:40 PM &nbsp;
                                    <span className="text-outerspace">Your order has been successfully verified.</span>
                                </p>
                            </OrderDetailMessageWrapper>

                            <OrderDetailListWrapper className="order-d-list">
                                {orderDetail.order_items?.map((item) => {
                                    const product = products.find((product) => product.id === item.product_id);
                                    const productVariant = productVariants.find(
                                        (variant) => variant.id === item.product_variant_id
                                    );
                                    const colorDetail = colors.find((color) => color.id === productVariant?.color_id);
                                    const sizeDetail = sizes.find((size) => size.id === productVariant?.size_id);
                                    return (
                                        <div className="order-d-item grid" key={item.product_id}>
                                            <div className="order-d-item-img">
                                                <img src={productVariant.image_url} alt="" className="object-fit-cover" />
                                            </div>
                                            <div className="order-d-item-info">
                                                <p className="text-xl font-bold">{product?.name}</p>
                                                <p className="text-md font-bold">
                                                    Color: &nbsp;
                                                    <span className="font-medium text-gray">{colorDetail.name || "Không có màu"}</span>
                                                </p>
                                                <p className="text-md font-bold">
                                                    Size: &nbsp;
                                                    <span className="font-medium text-gray">{sizeDetail.name || "Không có size"}</span>
                                                </p>
                                            </div>
                                            <div className="order-d-item-calc">
                                                <p className="font-bold text-lg">
                                                    Quantity: &nbsp;
                                                    <span className="text-gray">{item?.quantity}</span>
                                                </p>
                                                <p className="font-bold text-lg">
                                                    Price: &nbsp;
                                                    <span className="text-gray">{formatCurrency(productVariant?.price)}</span>
                                                </p>
                                            </div>
                                            <button type="button" className="text-xl text-outerspace order-d-item-btn">
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </div>
                                    );
                                })}
                            </OrderDetailListWrapper>
                        </div>
                    </UserContent>
                </UserDashboardWrapper>
            </Container>
        </OrderDetailScreenWrapper>
    );
};

export default OrderDetailScreen;
