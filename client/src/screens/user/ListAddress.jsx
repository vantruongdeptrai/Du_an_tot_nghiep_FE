import { useState } from "react";
import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import useAddress from "../../hooks/useAddress";
import AddressModal from "../../components/modals/ModalAdd";
import { toast } from "react-toastify";

// Styled components
const AccountScreenWrapper = styled.main`
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

    .default-label {
        color: red;
        font-weight: bold;
        border: 1px solid red;
        padding: 2px 5px;
    }

    .button-update {
        background-color: ${defaultTheme.color_yellow};
        color: ${defaultTheme.color_white};
        width: 120px;
        height: 35px;
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

const ListAddressScreen = () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addresses, createAddress, setDefaultAddress } = useAddress();

    const addressByUser = Array.isArray(addresses) ? addresses.filter((address) => address.id == user.id) : [];
    console.log(addressByUser);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddAddress = async (addressData) => {
        await createAddress(addressData);
        toast.success("Thêm địa chỉ thành công.");
        handleCloseModal();
    };

    const handleSetDefaultAddress = (addressId) => {
        setDefaultAddress(addressId); // Assume this function sets the default address in the state or backend
    };

    if (!user) {
        return <p>User not found. Please log in again.</p>;
    }

    return (
        <AccountScreenWrapper className="page-py-spacing">
            <Container>
                <Breadcrumb
                    items={[
                        { label: "Home", link: "/" },
                        { label: "Address", link: "/address" },
                    ]}
                />
                <UserDashboardWrapper>
                    <UserMenu />
                    <UserContent>
                        <Title titleText={"My Address"} />
                        <div>
                            <button className="button-add" onClick={handleOpenModal}>
                                Thêm Địa Chỉ
                            </button>
                            <AddressModal
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                                onConfirm={handleAddAddress}
                            />
                        </div>
                        <h2 style={{ marginTop: 20 }}>Địa chỉ</h2>
                        <div className="address-list">
                            {addressByUser.length === 0 ? (
                                <div>No addresses added yet.</div>
                            ) : (
                                addressByUser.map((address, index) => (
                                    <div key={index} className="address-item">
                                        <div className="address-info">
                                            <div>
                                                {" "}
                                                {address.addresses.map((item, subIndex) => {
                                                    return (
                                                        <div
                                                            style={{
                                                                fontSize: 16,
                                                                opacity: 0.8,
                                                                borderBottom: "1px solid #ccc",
                                                                paddingBottom: 10,
                                                                margin: "30px 0",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                            }}
                                                            key={subIndex}
                                                            className="flex"
                                                        >
                                                            <div>
                                                                <div className="flex" style={{ gap: 20 }}>
                                                                    <strong
                                                                        style={{
                                                                            borderRight: "1px solid #ccc",
                                                                            paddingRight: 20,
                                                                            fontSize: 18,
                                                                        }}
                                                                    >
                                                                        {address.name}
                                                                    </strong>
                                                                    <div style={{ fontSize: 16, opacity: 0.8 }}>
                                                                        {address.phone}
                                                                    </div>
                                                                </div>
                                                                <div style={{ margin: "6px 0" }}>
                                                                    {item.full_address}
                                                                </div>
                                                                <div>
                                                                    {item.is_default == 1 ? (
                                                                        <span className="default-label">Mặc định</span>
                                                                    ) : (
                                                                        ""
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
                                                                    <button
                                                                        className="button-update"
                                                                        // onClick={() => handleDeleteAddress(address._id)}
                                                                    >
                                                                        Cập nhật
                                                                    </button>
                                                                    <button
                                                                        className="button"
                                                                        onClick={() =>
                                                                            handleSetDefaultAddress(address._id)
                                                                        }
                                                                    >
                                                                        Thiết lập mặc định
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ); // Thêm return vào đây
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </UserContent>
                </UserDashboardWrapper>
            </Container>
        </AccountScreenWrapper>
    );
};

export default ListAddressScreen;
