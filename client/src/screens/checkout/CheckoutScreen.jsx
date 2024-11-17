import styled from "styled-components";
import { Container } from "../../styles/styles";
import Title from "../../components/common/Title";
import Billing from "../../components/checkout/Billing";
import ShippingPayment from "../../components/checkout/ShippingPayment";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { FormProvider, useForm } from "react-hook-form";
import { BaseButtonGreen } from "../../styles/button";
import useOrder from "../../hooks/useOrder";
import { toast } from "react-toastify";

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
        const paymentType = data.payment_type;
        
        const userId = user ? user.id : null;

        if (paymentType == "VNPay") {
            // Nếu chọn thanh toán VNPay, gọi API tạo URL thanh toán
            const response = await createOrder(data, userId, orderItems, paymentType);
            console.log(response.data.payment_url);
            localStorage.removeItem('orderItems')
            
            // if (response?.data) {
            //     // Chuyển hướng đến URL thanh toán VNPay
            //     window.location.href = response.payment_url;
            // } else {
            //     console.error("Failed to generate VNPay payment URL.");
            // }
        } else {
            // Nếu không phải VNPay, gọi hàm tạo đơn hàng bình thường
            await createOrder(data, userId, orderItems);    
            localStorage.removeItem('orderItems')
        }
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
