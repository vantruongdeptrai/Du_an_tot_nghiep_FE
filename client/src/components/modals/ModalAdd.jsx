import styled from "styled-components";
import { useForm } from "react-hook-form";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { provinces } from "../../data/data";
import { useState } from "react";

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;

    .modal-content {
        background-color: ${defaultTheme.color_white};
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: 30px;

        height: auto;

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

            select {
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
    }
`;

const AddressModal = ({ isOpen, onClose, onConfirm }) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [selectedProvince, setSelectedProvince] = useState(null); // Tỉnh được chọn
    const [selectedDistrict, setSelectedDistrict] = useState(null); // Quận được chọn
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const address = {
            street: data.street,
            ward: data.ward,
            district: data.district,
            city: data.city,
            country: data.country,
            is_default: 0,
        };

        // Gọi hàm onConfirm từ parent component với dữ liệu từ form
        const payload = {
            user_id: user?.id, // lấy user_id từ localStorage hoặc dữ liệu đã có
            addresses: [address], // Mảng địa chỉ (có thể mở rộng thêm nếu cần)
        };
        // Gọi hàm onConfirm từ parent component với dữ liệu từ form
        onConfirm(payload);
    };
    const handleProvinceChange = (event) => {
        const province = provinces.find((prov) => prov.name === event.target.value);
        setSelectedProvince(province);
        setSelectedDistrict(null); // Reset quận khi đổi tỉnh
        setValue("district", ""); // Reset giá trị district
        setValue("ward", ""); // Reset giá trị ward
    };
    // Xử lý chọn quận/huyện
    const handleDistrictChange = (event) => {
        const district = selectedProvince?.districts.find((dist) => dist.name === event.target.value);
        setSelectedDistrict(district);
        setValue("ward", ""); // Reset xã/phường khi chọn quận/huyện mới
    };

    const handleClose = () => {
        reset(); // Đảm bảo reset form khi đóng modal
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalWrapper>
            <div className="modal-content">
                <div className="modal-header">Thêm Địa Chỉ</div>
                <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                    <div>
                        <input
                            value={user?.id}
                            id="user_id"
                            type="hidden"
                            {...register("user_id", { required: "User ID is required" })}
                        />
                        {errors.user_id && <span>{errors.user_id.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="city">Tỉnh / Thành phố</label>
                        <select
                            id="city"
                            {...register("city", { required: "Không được bỏ trống!" })}
                            defaultValue=""
                            onChange={handleProvinceChange}
                        >
                            <option value="" disabled>
                                Chọn tỉnh / thành phố...
                            </option>
                            {provinces.map((province) => (
                                <option key={province.id} value={province.name}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                        {errors.city && <span>{errors.city.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="district">Quận / Huyện</label>
                        <select
                            id="district"
                            {...register("district", { required: "Không được bỏ trống!" })}
                            defaultValue=""
                            onChange={(event) => {
                                const district = selectedProvince?.districts.find(
                                    (dist) => dist.name === event.target.value
                                );
                                setSelectedDistrict(district);
                            }}
                            disabled={!selectedProvince} // Vô hiệu hóa nếu chưa chọn tỉnh
                        >
                            <option value="" disabled>
                                Chọn quận / huyện...
                            </option>
                            {selectedProvince?.districts.map((district) => (
                                <option key={district.id} value={district.name}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                        {errors.district && <span>{errors.district.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="ward">Xã / Phường</label>
                        <select
                            id="ward"
                            {...register("ward", { required: "Không được bỏ trống!" })}
                            defaultValue=""
                            disabled={!selectedDistrict}
                        >
                            <option value="" disabled>
                                Chọn xã / phường...
                            </option>
                            {selectedDistrict?.wards?.map((ward) => (
                                <option key={ward.id} value={ward.name}>
                                    {ward.name}
                                </option>
                            ))}
                        </select>
                        {errors.ward && <span>{errors.ward.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="street">Địa chỉ cụ thể</label>
                        <input
                            id="street"
                            type="text"
                            {...register("street", { required: "Không được bỏ trống!" })}
                            placeholder="Địa chỉ cụ thể..."
                        />
                        {errors.street && <span>{errors.street.message}</span>}
                    </div>

                    <button className="confirm-btn" type="submit">
                        Xác nhận
                    </button>
                </form>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={handleClose}>
                        Hủy
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AddressModal;
