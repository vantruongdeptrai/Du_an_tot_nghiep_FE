import styled from "styled-components";
import { Container } from "../../styles/styles";
import Title from "../../components/common/Title";
import Billing from "../../components/checkout/Billing";
import ShippingPayment from "../../components/checkout/ShippingPayment";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { FormProvider, useForm } from "react-hook-form";
import { BaseButtonGreen } from "../../styles/button";
import useOrder from "../../hooks/useOrder";
import { useNavigate } from "react-router-dom";
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
    const { createOrder, sendInvoice } = useOrder();
    const nav = useNavigate();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const orderItems = JSON.parse(localStorage.getItem("orderItems"));

    // Hàm xử lý submit khi người dùng ấn "Pay Now"
    const handleSubmitOrder = async (data) => {
        const paymentType = data.payment_type;

        if (!paymentType) {
            toast.warn("Vui lòng chọn phương thức thanh toán."); // Hoặc xử lý thông báo lỗi khác
            return;
        }

        const userId = user ? user.id : null;

        if (paymentType == "VNPAY") {
            // Nếu chọn thanh toán VNPay, gọi API tạo URL thanh toán
            const response = await createOrder(data, userId, orderItems, paymentType);
            console.log(response);

            localStorage.removeItem("orderItems");
            if (response) {
                // Chuyển hướng đến URL thanh toán VNPay
                window.location.href = response;
            } else {
                console.error("Failed to generate VNPay payment URL.");
            }
        } else {
            // Nếu không phải VNPay, gọi hàm tạo đơn hàng bình thường
            const response = await createOrder(data, userId, orderItems);
            
            if (response && response.order_id) {
                // Gọi hàm gửi hóa đơn
                await sendInvoice(response.order_id, user.email);
                toast.success("Thanh toán thành công!");
            } else {
                console.error("Không lấy được orderId từ phản hồi createOrder.");
            }
            nav("/confirm");
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
                            Thanh toán ngay
                        </BaseButtonGreen>
                    </form>
                </FormProvider>
            </Container>
        </CheckoutScreenWrapper>
    );
};

export default CheckoutScreen;
