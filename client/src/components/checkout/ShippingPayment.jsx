import styled from "styled-components";
import { Input } from "../../styles/form";
import { cardsData } from "../../data/data";
import { useFormContext } from "react-hook-form";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const ShippingPaymentWrapper = styled.div`
    .shipping-addr,
    .shipping-method,
    .payment-method {
        margin: 20px 0;

        &-title {
            margin-bottom: 8px;
        }

        .list-group {
            padding: 24px;
            background-color: ${defaultTheme.color_whitesmoke};
            max-width: 818px;
            margin-top: 24px;
            border-radius: 12px;

            @media (max-width: ${breakpoints.sm}) {
                padding: 16px;
                border-radius: 8px;
                margin-top: 16px;
            }
        }

        .list-group-item {
            column-gap: 20px;
            opacity: 1; /* Mặc định không mờ */
            pointer-events: auto; /* Mặc định có thể click */
            cursor: pointer; /* Mặc định con trỏ là pointer */

            &.disabled {
                opacity: 0.5; /* Làm mờ */
                pointer-events: none; /* Vô hiệu hóa các sự kiện */
                cursor: not-allowed; /* Thay đổi con trỏ */
            }
        }

        .horiz-line-separator {
            margin: 20px 0;
            @media (max-width: ${breakpoints.sm}) {
                margin: 12px 0;
            }
        }
    }

    .payment-method {
        .list-group-item {
            &-head {
                column-gap: 20px;
            }
        }

        .payment-cards {
            gap: 20px;
            margin: 24px 0 30px 34px;

            @media (max-width: ${breakpoints.lg}) {
                gap: 16px;
            }

            @media (max-width: ${breakpoints.sm}) {
                margin-top: 16px;
                margin-bottom: 16px;
                gap: 10px;
                margin-left: 0;
            }

            .payment-card {
                position: relative;
                width: 80px;
                height: 46px;
                opacity: 1; /* Mặc định không mờ */
                pointer-events: auto; /* Mặc định có thể click */
                cursor: pointer; /* Mặc định con trỏ là pointer */

                &.disabled {
                    opacity: 0.5; /* Làm mờ */
                    pointer-events: none; /* Vô hiệu hóa các sự kiện */
                    cursor: not-allowed; /* Thay đổi con trỏ */
                }

                input {
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 80px;
                    height: 46px;
                    z-index: 10;
                    cursor: pointer;

                    &:checked {
                        & + .card-wrapper {
                            .card-selected {
                                position: absolute;
                                top: -8px;
                                right: -5px;
                                width: 14px;
                                height: 14px;
                                display: inline-block;
                            }
                        }
                    }
                }

                .card-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-radius: 5px;
                    border: 1px solid rgba(0, 0, 0, 0.1);

                    .card-selected {
                        display: none;
                        transition: ${defaultTheme.default_transition};
                    }
                }
            }
        }
    }

    .pay-now-btn {
        @media (max-width: ${breakpoints.sm}) {
            width: 100%;
        }
    }
`;

const ShippingPayment = () => {
    const { register } = useFormContext();
    const isLoggedIn = !!localStorage.getItem("userInfo");

    return (
        <ShippingPaymentWrapper>
            <div className="payment-method">
                <h3 className="text-xxl payment-method-title">Payment Method</h3>
                <p className="text-base text-outerspace">All transactions are secure and encrypted.</p>
                <form>
                    <div className="list-group">
                        <div
                            className={`list-group-item ${!isLoggedIn ? "disabled" : ""}`}
                        >
                            <div className="flex items-center list-group-item-head">
                                <Input
                                    type="radio"
                                    className="list-group-item-check"
                                    name="payment_method"
                                    disabled={!isLoggedIn}
                                />
                                <p className="font-semibold text-lg">
                                    Credit Card
                                    <span className="flex text-base font-medium text-gray">
                                        We accept all major credit cards.
                                    </span>
                                </p>
                            </div>
                            <div className="payment-cards flex flex-wrap">
                                {cardsData?.map((card) => (
                                    <div
                                        className={`payment-card flex items-center justify-center ${
                                            !isLoggedIn ? "disabled" : ""
                                        }`}
                                        key={card.id}
                                    >
                                        <Input
                                            type="radio"
                                            name="payment_cards"
                                            disabled={!isLoggedIn}
                                        />
                                        <div className="card-wrapper bg-white w-full h-full flex items-center justify-center">
                                            <img src={card.imgSource} alt="" />
                                            <div className="card-selected text-sea-green">
                                                <i className="bi bi-check-circle-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="horiz-line-separator"></div>

                        <div className="list-group-item flex items-center">
                            <Input
                                {...register("payment_type")}
                                type="radio"
                                className="list-group-item-check"
                                value={"Tiền mặt"}
                            />
                            <p className="font-semibod text-lg">
                                Cash on delivery
                                <span className="flex text-base font-medium text-gray">
                                    Pay with cash upon delivery.
                                </span>
                            </p>
                        </div>

                        <div style={{marginTop: 20}}
                            className={`list-group-item flex items-center ${
                                !isLoggedIn ? "disabled" : ""
                            }`}
                        >
                            <Input
                                {...register("payment_type")}
                                type="radio"
                                className="list-group-item-check"
                                value="VNPay"
                                disabled={!isLoggedIn}
                            />
                            <p className="font-semibod text-lg">
                                VNPAY
                                <span className="flex text-base font-medium text-gray">
                                    Pay with VNPAY
                                </span>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </ShippingPaymentWrapper>
    );
};

export default ShippingPayment;
