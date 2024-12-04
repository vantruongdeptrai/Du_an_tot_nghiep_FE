import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "../../styles/form";
import CheckoutSummary from "./CheckoutSummary";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import ModalAddress from "../../components/modals/ModalAddress";
import useAddress from "../../hooks/useAddress";
import useUser from "../../hooks/useUser";

const BillingOrderWrapper = styled.div`
    gap: 60px;
    grid-template-columns: 2fr 1fr;

    @media (max-width: ${breakpoints.xl}) {
        gap: 40px;
    }
    @media (max-width: ${breakpoints.lg}) {
        gap: 30px;
        grid-template-columns: 100%;
    }
    .address-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 20px;
    }

    .address-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: ${defaultTheme.color_white};
    }

    .address-info {
        flex: 1;
    }
    .button-update {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${defaultTheme.color_yellow};
        color: ${defaultTheme.color_white};
        padding: 5px 10px;
        font-size: 16px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
        &:hover {
            background-color: ${defaultTheme.color_yellow_green};
            transform: scale(1.1);
        }
    }

    .button-delete {
        background-color: ${defaultTheme.color_red};
        color: ${defaultTheme.color_white};
        width: 80px;
        height: 35px;
        font-size: 14px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
        &:hover {
            background-color: ${defaultTheme.color_dim_gray};
            transform: scale(1.1);
        }
    }

    .button-add {
        background-color: ${defaultTheme.color_sea_green};
        color: white;
        font-size: 16px;
        border: 1px solid ${defaultTheme.color_sea_green};
        border-radius: 8px;
        padding: 6px 16px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s;

        &:hover {
            background-color: ${defaultTheme.color_sea_green_v1};
            transform: scale(1.1);
        }
    }
    .button {
        border: 1px solid #ccc;
        padding: 4px 6px;
        font-size: 16px;
    }
`;

const BillingDetailsWrapper = styled.div`
    @media (max-width: ${breakpoints.lg}) {
        order: 2;
    }

    .checkout-form {
        margin-top: 24px;

        .input-elem {
            margin-bottom: 16px;

            @media (max-width: ${breakpoints.xs}) {
                margin-bottom: 10px;
            }

            label {
                margin-bottom: 8px;
                display: block;
            }

            input,
            select {
                height: 40px;
                border-radius: 4px;
                background: ${defaultTheme.color_whitesmoke};
                padding-left: 12px;
                padding-right: 12px;
                width: 100%;
                border: 1px solid ${defaultTheme.color_platinum};
                font-size: 12px;

                &::placeholder {
                    font-size: 12px;
                }
            }
        }

        .elem-col-2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: 24px;

            @media (max-width: ${breakpoints.lg}) {
                column-gap: 12px;
            }
            @media (max-width: ${breakpoints.sm}) {
                grid-template-columns: 100%;
            }
        }

        .elem-col-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            column-gap: 24px;

            @media (max-width: ${breakpoints.lg}) {
                column-gap: 12px;
            }
            @media (max-width: ${breakpoints.sm}) {
                grid-template-columns: 100%;
            }
        }

        .input-check-group {
            column-gap: 10px;
            margin-top: 16px;
        }
        .contd-delivery-btn {
            margin-top: 20px;

            @media (max-width: ${breakpoints.sm}) {
                width: 100%;
            }
        }
    }
    .default-label {
        color: red;
        border: 1px solid red;
    }
`;

const Billing = () => {
    const { register, setValue } = useFormContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const {users} = useUser();
    const userBilling = users.find(users => users.id == user.id);
    
    const [addressToUpdate, setAddressToUpdate] = useState(null);
    const { addresses } = useAddress();

    const addressByUser = Array.isArray(addresses) ? addresses.filter((address) => address?.id == user?.id) : [];
    const defaultAddress = addressByUser.flatMap((address) =>
        address.addresses.filter((item) => item.is_default === 1)
    );

    // const defaultShippingAddress =
    //     defaultAddress.length > 0 ? defaultAddress[0].full_address : "No default address set";

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        // const storedUserInfo = localStorage.getItem("userInfo");
        if (userBilling) {
            try {
                // Điền giá trị vào form nếu user tồn tại
                setValue("name_order", userBilling.name || "");
                setValue("email_order", userBilling.email || "");
                setValue("phone_order", userBilling.phone || "");
                if (addressToUpdate) {
                    setValue("shipping_address", addressToUpdate.full_address);
                } else if (defaultAddress.length > 0) {
                    setValue("shipping_address", defaultAddress[0].full_address);
                }
            } catch (error) {
                console.error("Failed to parse userInfo from localStorage:", error);
            }
        }
    }, [setValue, addressToUpdate, userBilling, defaultAddress]);
    const handleOpenModal = (address) => {
        setAddressToUpdate(address);
        setIsModalOpen(true); // Mở modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Đóng modal
    };

    // const handleSetDefaultAddress = (addressId) => {
    //     setDefaultAddress(addressId); // Assume this function sets the default address in the state or backend
    // };

    return (
        <BillingOrderWrapper className="billing-and-order grid items-start">
            {user ? (
                <BillingDetailsWrapper>
                    <div>
                        <h2 style={{ marginTop: 20 }}>Địa chỉ của tôi</h2>
                        <div className="address-list">
                            {defaultAddress.length === 0 ? (
                                <div></div>
                            ) : (
                                defaultAddress.map((address, index) => (
                                    <div key={index} className="address-item">
                                        <div className="address-info">
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: 16,
                                                        opacity: 0.8,
                                                        borderBottom: "1px solid #ccc",
                                                        paddingBottom: 10,
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                    }}
                                                    key={address}
                                                    className="flex"
                                                >
                                                    <div>
                                                        <div>
                                                            <strong>Địa chỉ đã chọn:</strong>{" "}
                                                            {addressToUpdate ? (
                                                                <span>{addressToUpdate.full_address}</span>
                                                            ) : (
                                                                <span>{address.full_address}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: 20,
                                                            }}
                                                        >
                                                            <div
                                                                className="button-update"
                                                                onClick={() => {
                                                                    setIsModalOpen(true); // Mở modal
                                                                }}
                                                            >
                                                                Thay đổi
                                                            </div>
                                                            {isModalOpen && (
                                                                <ModalAddress
                                                                    isOpen={isModalOpen}
                                                                    onClose={handleCloseModal}
                                                                    onConfirm={handleOpenModal}
                                                                    addressToUpdate={addressToUpdate || address}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <h4 className="text-xxl font-bold text-outerspace">Thông tin chi tiết</h4>
                    <form className="checkout-form">
                        <div className="input-elem">
                            <label htmlFor="" className="text-base text-outerspace font-semibold">
                                Họ và tên *
                            </label>
                            <Input {...register("name_order")} type="text" placeholder="Full name" />
                        </div>
                        <div className="input-elem">
                            <label htmlFor="" className="text-base text-outerspace font-semibold">
                                Email *
                            </label>
                            <Input {...register("email_order")} type="text" placeholder="Email" />
                        </div>
                        <div className="input-elem">
                            <Input type="hidden" {...register("shipping_address")} placeholder="Shipping address" />
                        </div>
                        <div className="input-elem">
                            <label htmlFor="" className="text-base text-outerspace font-semibold">
                                Số điện thoại *
                            </label>
                            <Input {...register("phone_order")} type="text" placeholder="Phone number" />
                        </div>
                        <div className="input-elem">
                            <label htmlFor="" className="text-base text-outerspace font-semibold">
                                Ghi chú *
                            </label>
                            <textarea
                                {...register("user_note")}
                                style={{ width: "100%", height: "200px", padding: "10px" }}
                                type="text"
                                placeholder="Note"
                            />
                        </div>
                    </form>
                </BillingDetailsWrapper>
            ) : (
                <BillingDetailsWrapper>
                    <h4 className="text-xxl font-bold text-outerspace">Thông tin chi tiết</h4>
                    <form className="checkout-form">
                        <div className="input-elem">
                            <label htmlFor="" className="text-base text-outerspace font-semibold">
                                Họ và tên *
                            </label>
                            <Input {...register("name_order")} type="text" placeholder="Full name" />
                        </div>
                        <div className="input-elem">
                            <label htmlFor="" className="text-base text-outerspace font-semibold">
                                Email *
                            </label>
                            <Input {...register("email_order")} type="text" placeholder="Email" />
                        </div>
                        <div className="input-elem">
                            <label htmlFor="" className="text-base text-outerspace font-semibold">
                                Shipping address
                            </label>
                            <Input type="text" {...register("shipping_address")} placeholder="Shipping address" />
                        </div>
                        <div className="input-elem">
                            <label htmlFor="" className="text-base text-outerspace font-semibold">
                                Số điện thoại *
                            </label>
                            <Input {...register("phone_order")} type="text" placeholder="Phone number" />
                        </div>
                        <div className="input-elem">
                            <label htmlFor="" className="text-base text-outerspace font-semibold">
                                Ghi chú *
                            </label>
                            <textarea
                                {...register("user_note")}
                                style={{ width: "100%", height: "200px", padding: "10px" }}
                                type="text"
                                placeholder="Note"
                            />
                        </div>
                    </form>
                </BillingDetailsWrapper>
            )}
            <CheckoutSummary />
        </BillingOrderWrapper>
    );
};

export default Billing;
