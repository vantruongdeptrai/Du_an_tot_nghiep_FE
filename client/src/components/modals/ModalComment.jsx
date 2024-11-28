import styled from "styled-components";
import { useForm } from "react-hook-form";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import useComment from "../../hooks/useComment";
import { toast } from "react-toastify";
import apiClient from "../../api/axiosConfig";

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
        height: 500px;

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

            textarea {
                width: 100%;
                padding: 12px;
                font-size: 16px;
                border: 1px solid ${defaultTheme.color_gray_light};
                border-radius: 6px;
                outline: none;
                resize: vertical;
                min-height: 120px;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;

                &:focus {
                    border-color: ${defaultTheme.color_primary};
                    box-shadow: 0 0 5px ${defaultTheme.color_primary};
                }

                &::placeholder {
                    color: ${defaultTheme.color_gray};
                    font-style: italic;
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

const ModalComment = ({ product, isOpen, onClose, onConfirm }) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    console.log(product);

    const onSubmit = async (data) => {
        const productId = product?.id;

        if (!productId) {
            toast.error("Sản phẩm không hợp lệ.");
            return;
        }

        const response = await apiClient.post(`/products/${productId}/comments`, data);
        onConfirm(response.data);

        toast.success("Đánh giá sản phẩm thành công.");
    };

    const handleClose = () => {
        reset(); // Đảm bảo reset form khi đóng modal
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalWrapper>
            <div className="modal-content">
                <div className="modal-header">Đánh giá sản phẩm</div>
                <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                    <div>
                        <input {...register("user_id")} type="hidden" value={user?.id} />
                        <input {...register("product_id")} type="hidden" value={product?.id} />
                        <label htmlFor="ward">Bình luận</label>
                        <textarea
                            {...register("comment", { required: "Không được bỏ trống!" })}
                            placeholder="Mời đánh giá sản phẩm..."
                        />
                        {errors.ward && <span>{errors.ward.message}</span>}
                    </div>

                    <button className="confirm-btn" type="submit">
                        Đánh giá
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

export default ModalComment;
