import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import useAddress from "../../hooks/useAddress";
import AddressModal from "../../components/modals/ModalAdd";

// Styled components
const AccountScreenWrapper = styled.main`
    .address-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        border: none;
    }

    .address-table th,
    .address-table td {
        padding: 15px;
        text-align: left;
        border: 1px solid #ddd;
        border: none;
    }

    .address-table th {
        background-color: ${defaultTheme.color_light_gray};
        font-weight: bold;
    }

    .address-table td {
        background-color: ${defaultTheme.color_white};
    }

    .button-update {
        background-color: ${defaultTheme.color_yellow};
        color: ${defaultTheme.color_white};
        width: 80px;
        height: 35px;
        font-size: 14px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin: 0 10px;
        &:hover {
            background-color: ${defaultTheme.color_yellow_green};
            transform: scale(1.1); // Thêm hiệu ứng phóng to khi hover
        }

        &:focus {
            outline: none; // Loại bỏ outline khi nút được nhấn
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
        margin: 0 10px;
        &:hover {
            background-color: ${defaultTheme.color_dim_gray};
            transform: scale(1.1); // Thêm hiệu ứng phóng to khi hover
        }

        &:focus {
            outline: none; // Loại bỏ outline khi nút được nhấn
        }
    }

    .button:hover {
        background-color: ${defaultTheme.color_sea_green_v1};
    }
    .button-add {
        background-color: ${defaultTheme.color_sea_green};
        color: white;
        border: 1px solid ${defaultTheme.color_sea_green}; // Thêm border cho nút xóa
        border-radius: 8px; // Thêm bo góc cho nút
        padding: 6px 16px; // Điều chỉnh kích thước nút
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s; // Thêm hiệu ứng khi hover

        &:hover {
            background-color: ${defaultTheme.color_sea_green_v1};
            transform: scale(1.1); // Thêm hiệu ứng phóng to khi hover
        }

        &:focus {
            outline: none; // Loại bỏ outline khi nút được nhấn
        }
    }
    .address {
        white-space: nowrap; /* Không cho phép xuống dòng */
        overflow: hidden; /* Ẩn phần văn bản vượt ra ngoài */
        text-overflow: ellipsis; /* Hiển thị dấu ba chấm '...' khi văn bản quá dài */
        max-width: 180px; /* Giới hạn chiều rộng của cột tên sản phẩm */
    }
`;

const ListAddressScreen = () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addresses, createAddress } = useAddress();

    const addressByUser = addresses.filter((address) => address.id == user.id);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddAddress = (addressData) => {
        // Xử lý dữ liệu thêm địa chỉ
        createAddress(addressData);
        handleCloseModal(); // Đóng modal sau khi thêm thành công
    };

    // const handleUpdateAddress = async (addressId, updatedAddress) => {
    //     try {
    //         const response = await axios.put(`api/address/${addressId}`, updatedAddress);
    //         const updatedAddresses = addresses.map(address =>
    //             address._id === addressId ? response.data : address
    //         );
    //         setAddresses(updatedAddresses);
    //     } catch (error) {
    //         console.error('Error updating address:', error);
    //     }
    // };

    // const handleDeleteAddress = async (addressId) => {
    //     try {
    //         await axios.delete(`api/address/${addressId}`);
    //         const updatedAddresses = addresses.filter(address => address._id !== addressId);
    //         setAddresses(updatedAddresses);
    //     } catch (error) {
    //         console.error('Error deleting address:', error);
    //     }
    // };

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
                        {/* Nút thêm địa chỉ */}
                        <div>
                            <button className="button-add" onClick={handleOpenModal}>Thêm Địa Chỉ</button>
                            <AddressModal
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                                onConfirm={handleAddAddress}
                            />
                        </div>
                        <table className="address-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addressByUser.length === 0 ? (
                                    <tr>
                                        <td colSpan="4">No addresses added yet.</td>
                                    </tr>
                                ) : (
                                    addressByUser.map((address, index) => (
                                        <tr key={index}>
                                            <td>{address.name}</td>
                                            {address.addresses.map((item, subIndex) => {
                                                return (
                                                    <td key={subIndex} className="address">
                                                        {item.full_address}
                                                    </td>
                                                ); // Thêm return vào đây
                                            })}
                                            <td>{address.phone}</td>
                                            <td>
                                                <button
                                                    className="button-update"
                                                    // onClick={() => handleUpdateAddress(address._id, { name: 'New Name', address: 'New Address', phone: '123456' })}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="button-delete"
                                                    // onClick={() => handleDeleteAddress(address._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </UserContent>
                </UserDashboardWrapper>
            </Container>
        </AccountScreenWrapper>
    );
};

export default ListAddressScreen;
