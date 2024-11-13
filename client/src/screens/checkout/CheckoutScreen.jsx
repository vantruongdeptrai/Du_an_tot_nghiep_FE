import styled from "styled-components";
import { Container } from "../../styles/styles";
import Title from "../../components/common/Title";
import Billing from "../../components/checkout/Billing";
import ShippingPayment from "../../components/checkout/ShippingPayment";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { FormProvider, useForm } from "react-hook-form";
import { BaseButtonGreen } from "../../styles/button";
import useOrder from "../../hooks/useOrder";

const CheckoutScreenWrapper = styled.main`
    padding: 48px 0;
    .horiz-line-separator {
        height: 1px;
        background-color: ${defaultTheme.color_anti_flash_white};
        max-width: 818px;
        margin: 30px 0;

        @media (max-width: ${breakpoints.sm}) {
            margin: 20px 0;
        }
    }
`;

const CheckoutScreen = () => {
    const methods = useForm();
    const { createOrder } = useOrder();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const userId = user ? user.id : null;
    const orderItems = JSON.parse(localStorage.getItem("orderItems"));
    // Hàm xử lý submit khi người dùng ấn "Pay Now"
    const handleSubmitOrder = async (data) => {
        createOrder(data, userId, orderItems);
    };
    return (
        <CheckoutScreenWrapper>
            <Container>
                <Title titleText={"Check Out"} />
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleSubmitOrder)} action="">
                        <Billing />
                        <div className="horiz-line-separator w-full"></div>
                        <ShippingPayment />
                        <BaseButtonGreen type="submit" className="pay-now-btn">
                            Pay Now
                        </BaseButtonGreen>
                    </form>
                </FormProvider>
            </Container>
        </CheckoutScreenWrapper>
    );
};

export default CheckoutScreen;
