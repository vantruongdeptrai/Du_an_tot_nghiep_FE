import { useState, useEffect } from "react";
import styled from "styled-components";
import useAddress from "../../hooks/useAddress";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

// Styled components
const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* Nền mờ */
    z-index: 997; /* Đảm bảo modal luôn nổi trên các phần tử khác */
`;

const ModalContent = styled.div`
    background-color: ${defaultTheme.color_white};
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    height: 700px;
    overflow-y: auto;

    @media (max-width: ${breakpoints.sm}) {
        width: 90%;
    }

    .modal-header {
        font-size: 20px;
        margin-bottom: 16px;
        text-align: center;
    }

    .modal-body {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 10px 0;

        label {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
            color: ${defaultTheme.color_gray_dark};
        }

        input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 1px solid ${defaultTheme.color_gray_light};
            border-radius: 6px;
            outline: none;
            transition: border-color 0.2s;

            &:focus {
                border-color: ${defaultTheme.color_primary};
            }
        }

        span {
            color: ${defaultTheme.color_red};
            font-size: 14px;
            margin-top: 4px;
            display: block;
        }
    }

    .modal-footer {
        display: flex;
        justify-content: space-between;
        gap: 12px;
    }

    button {
        padding: 12px 16px;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
    }

    .cancel-btn {
        background-color: ${defaultTheme.color_gray};
        color: ${defaultTheme.color_white};
    }

    .cancel-btn:hover {
        opacity: 0.7;
    }

    .confirm-btn {
        background-color: ${defaultTheme.color_sea_green};
        color: ${defaultTheme.color_white};
    }

    .confirm-btn:hover {
        opacity: 0.7;
    }

    .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid ${defaultTheme.color_sea_green};
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .button-close {
        margin-top: 20px;
        background-color: ${defaultTheme.color_red};
        color: ${defaultTheme.color_white};
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        align-self: center;
        transition: background-color 0.3s;

        &:hover {
            background-color: ${defaultTheme.color_red_dark};
        }
    }

    input {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        appearance: none;
        border: 2px solid #ccc;
        margin-right: 10px;
        transition: all 0.3s ease;
    }

    input:checked {
        border-color: red;
        background-color: red;
    }

    input:checked::before {
        content: "";
        display: block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: white;
        margin: 4px;
    }
`;

const ModalAddress = ({ isOpen, onClose, onConfirm, addressToUpdate }) => {
    if (!isOpen) return null;

    const user = JSON.parse(localStorage.getItem("userInfo"));
    const { addresses } = useAddress();

    const addressByUser = Array.isArray(addresses) ? addresses.filter((address) => address.id === user.id) : [];
    
    const [selectedAddress, setSelectedAddress] = useState("hello");
    const [loading, setLoading] = useState(false); // State để theo dõi trạng thái loading

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
    };

    const handleConfirm = async () => {
        if (selectedAddress) {
            setLoading(true); // Bắt đầu loading khi xác nhận
            await onConfirm(selectedAddress); // Giả sử onConfirm là một hàm bất đồng bộ
            setLoading(false); // Dừng loading khi xong
            onClose(); // Đóng modal
        }
    };

    useEffect(() => {
        if (isOpen && addressToUpdate) {
            setSelectedAddress(addressToUpdate);
        }
    }, [isOpen, addressToUpdate]);

    return (
        <ModalWrapper>
            <ModalContent>
                <h2 className="modal-header">Địa chỉ</h2>
                <div className="address-list">
                    {addressByUser.length === 0 ? (
                        <div>No addresses added yet.</div>
                    ) : (
                        addressByUser.map((address, index) => (
                            <div key={index} className="address-item">
                                <div className="address-info">
                                    {address.addresses.map((item, subIndex) => (
                                        <div
                                            key={subIndex}
                                            className="flex"
                                            style={{
                                                fontSize: 16,
                                                opacity: 0.8,
                                                borderBottom: "1px solid #ccc",
                                                paddingBottom: 10,
                                                margin: "30px 0",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div>
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    onChange={() => handleSelectAddress(item)}
                                                    checked={selectedAddress?.id === item.id}
                                                />
                                            </div>
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
                                                    <div style={{ fontSize: 16, opacity: 0.8 }}>{address.phone}</div>
                                                </div>
                                                <div style={{ margin: "6px 0" }}>{item.full_address}</div>
                                                {item.is_default === 1 && (
                                                    <span className="default-label">Mặc định</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="button-close">
                        Đóng
                    </button>
                    <button onClick={handleConfirm} className="confirm-btn">
                        {loading ? <div className="loading-spinner" /> : "Xác nhận"} {/* Hiển thị spinner khi loading */}
                    </button>
                </div>
            </ModalContent>
        </ModalWrapper>
    );
};

export default ModalAddress;