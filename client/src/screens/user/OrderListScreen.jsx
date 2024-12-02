import { useState } from "react";
import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import OrderItemList from "../../components/user/OrderItemList";
import useOrder from "../../hooks/useOrder";
import useUser from "../../hooks/useUser";

const OrderListScreenWrapper = styled.div`
    .order-tabs-contents {
        margin-top: 40px;
    }
    .order-tabs-head {
        min-width: 170px;
        padding: 12px 0;
        border-bottom: 3px solid ${defaultTheme.color_whitesmoke};

        &.order-tabs-head-active {
            border-bottom-color: ${defaultTheme.color_outerspace};
        }

        @media (max-width: ${breakpoints.lg}) {
            min-width: 120px;
        }

        @media (max-width: ${breakpoints.xs}) {
            min-width: 80px;
        }
    }
`;

const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Order", link: "/order" },
];

const OrderListScreen = () => {
    const [activeTab, setActiveTab] = useState("active"); // state để lưu tab đang được chọn
    const { orders } = useOrder();
    const { user } = useUser();
    console.log(user);
    
    const userOrders = orders.filter((item) => item.user_id == user?.id);
    const guestOrder = JSON.parse(localStorage.getItem('guestOrder'));
    
    return (
        <OrderListScreenWrapper className="page-py-spacing">
            <Container>
                <Breadcrumb items={breadcrumbItems} />
                <UserDashboardWrapper>
                    <UserMenu />
                    <UserContent>
                        <Title titleText={"Đơn hàng của tôi"} />
                        <div className="order-tabs">
                            <div className="order-tabs-heads">
                                {/* Các nút Tab */}
                                <button
                                    type="button"
                                    className={`order-tabs-head text-xl italic ${
                                        activeTab === "active" ? "order-tabs-head-active" : ""
                                    }`}
                                    onClick={() => setActiveTab("active")}
                                >
                                    Đang chờ xác nhận
                                </button>
                                {/* <button
                                    type="button"
                                    className={`order-tabs-head text-xl italic ${
                                        activeTab === "cancelled" ? "order-tabs-head-active" : ""
                                    }`}
                                    onClick={() => setActiveTab("cancelled")}
                                >
                                    Đã hủy
                                </button>
                                <button
                                    type="button"
                                    className={`order-tabs-head text-xl italic ${
                                        activeTab === "completed" ? "order-tabs-head-active" : ""
                                    }`}
                                    onClick={() => setActiveTab("completed")}
                                >
                                    Hoàn thành
                                </button> */}
                            </div>

                            {/* Nội dung của các tab */}
                            <div className="order-tabs-contents">
                                {activeTab === "active" && (
                                    <div className="order-tabs-content" id="active">
                                        <OrderItemList orders={userOrders} guestOrders={guestOrder} />
                                    </div>
                                )}
                                {/* {activeTab === "cancelled" && (
                                    <div className="order-tabs-content" id="cancelled">
                                        
                                    </div>
                                )}
                                {activeTab === "completed" && (
                                    <div className="order-tabs-content" id="completed">
                                        
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </UserContent>
                </UserDashboardWrapper>
            </Container>
        </OrderListScreenWrapper>
    );
};

export default OrderListScreen;
