import { useState } from "react";

import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { defaultTheme } from "../../styles/themes/default";
import useAddress from "../../hooks/useAddress";
import AddressModal from "../../components/modals/ModalAdd";

import { toast } from "react-toastify";
import AddressEditModal from "../../components/modals/ModalEdit";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/loader";

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
            opacity: 0.8;
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
            opacity: 0.8;
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
        &:hover {
            opacity: 0.5;
        }
    }
`;

const ListAddressScreen = () => {
    const nav = useNavigate();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Chỉnh sửa địa chỉ

    const { addresses, isLoading ,createAddress, updateAddress, updateDefaultAddressApi, deleteAddress } = useAddress();

    const addressByUser = Array.isArray(addresses) ? addresses.filter((address) => address?.id == user?.id) : [];
    console.log(addressByUser);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Xử lý mở modal chỉnh sửa địa chỉ
    const handleOpenEditModal = () => {
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleAddAddress = async (addressData) => {
        await createAddress(addressData);
        toast.success("Thêm địa chỉ thành công.");
        handleCloseModal();
    };

    const handleEditAddress = async (addressData) => {
        await updateAddress(addressData);
        handleCloseEditModal();
    };

    const handleSetDefaultAddress = async (address) => {
        if (address.is_default === 1) {
            toast.info("Địa chỉ này đã là mặc định.");
            return;
        }
        await updateDefaultAddressApi(address);
    };

    const handleDeleteDefaultAddress = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) {
            deleteAddress(id);
        }
    };

    if (!user) {
        return nav("/sign_in"); // Điều hướng đúng khi không có user
    }

    if(isLoading) {
        return <p>
            <Loader />
        </p>
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
                        <Title titleText={"Địa chỉ của tôi"} />

                        <div>
                            <button className="button-add" onClick={handleOpenModal}>
                                Thêm Địa Chỉ
                            </button>

                            {isModalOpen && (
                                <AddressModal
                                    isOpen={isModalOpen}
                                    onClose={handleCloseModal}
                                    onConfirm={handleAddAddress}
                                />
                            )}
                        </div>

                        
                        <div className="address-list">
                            {addressByUser.length === 0 ? (
                                <div>Chưa có địa chỉ nào.</div>
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
                                                                    <div className="flex" style={{ gap: 20 }}>
                                                                        <button
                                                                            className="button-update"
                                                                            onClick={handleOpenEditModal}
                                                                        >
                                                                            Cập nhật
                                                                        </button>
                                                                        {isEditModalOpen && (
                                                                            <AddressEditModal
                                                                                isOpen={isEditModalOpen}
                                                                                onClose={handleCloseEditModal}
                                                                                onConfirm={handleEditAddress}
                                                                                currentAddress={item}
                                                                            />
                                                                        )}

                                                                        <button
                                                                            className="button-delete"
                                                                            onClick={() =>
                                                                                handleDeleteDefaultAddress(item.id)
                                                                            }
                                                                        >
                                                                            Xóa
                                                                        </button>
                                                                    </div>

                                                                    {item.is_default === 0 ? (
                                                                        <button style={{borderRadius: "5px"}}
                                                                            className="button"
                                                                            onClick={() =>
                                                                                handleSetDefaultAddress(item)
                                                                            }
                                                                        >
                                                                            Thiết lập mặc định
                                                                        </button>
                                                                    ) : (
                                                                        ""
                                                                    )}
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
