import styled from "styled-components";
import { useForm } from "react-hook-form";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { toast } from "react-toastify";
import apiClient from "../../api/axiosConfig";
import { useState } from "react";
import React from "react";

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

const StarContainer = styled.div`
    * {
        margin: 0;
        padding: 0;
    }
    .rate {
        float: left;
        height: auto;
    }
    .rate:not(:checked) > input {
        position: absolute;
        top: -9999px;
    }
    .rate:not(:checked) > label {
        float: right;
        width: 1em;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        font-size: 30px;
        color: #ccc;
    }
    .rate:not(:checked) > label:before {
        content: "★ ";
    }
    .rate > input:checked ~ label {
        color: #ffc700;
    }
    .rate:not(:checked) > label:hover,
    .rate:not(:checked) > label:hover ~ label {
        color: #deb217;
    }
    .rate > input:checked + label:hover,
    .rate > input:checked + label:hover ~ label,
    .rate > input:checked ~ label:hover,
    .rate > input:checked ~ label:hover ~ label,
    .rate > label:hover ~ input:checked ~ label {
        color: #c59b08;
    }
`;
// Nếu dùng toast để hiển thị thông báo

const ModalComment = ({ product, isOpen, onClose, onConfirm }) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm();

    const ratingValue = watch("rating");
    console.log(ratingValue);
     // Theo dõi giá trị rating

    const onSubmit = async (data) => {
        const productId = product?.id;
        console.log(data);
        if (!productId) {
            toast.error("Sản phẩm không hợp lệ.");
            return;
        }
        try {
            const response = await apiClient.post(`/products/${productId}/comments`, data);
            onConfirm(response.data);
            toast.success("Đánh giá sản phẩm thành công.");
            handleClose();
        } catch (error) {
            console.log(error);
            
        }
    };

    const handleClose = () => {
        reset(); // Reset form khi đóng modal
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalWrapper>
            <div className="modal-content">
                <div className="modal-header">Đánh giá sản phẩm</div>
                <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                    <input {...register("user_id")} type="hidden" value={user?.id} />
                    <input {...register("product_id")} type="hidden" value={product?.id} />

                    <label htmlFor="comment">Bình luận</label>
                    <textarea
                        {...register("comment", { required: "Không được bỏ trống!" })}
                        placeholder="Mời đánh giá sản phẩm..."
                    />
                    {errors.comment && <span>{errors.comment.message}</span>}

                    {/* Star Rating */}
                    <label htmlFor="">Đánh giá sao</label>
                    <StarContainer>
                        <div className="rate">
                            {[5, 4, 3, 2, 1].map((star) => {
                                console.log(star); // Log giá trị của star tại mỗi vòng lặp
                                return (
                                    <React.Fragment key={star}>
                                        <input
                                            {...register("rating", { required: "Chưa chọn số sao!" })}
                                            type="radio"
                                            id={`star${star}`}
                                            value={star}
                                        />
                                        <label htmlFor={`star${star}`} title={`${star} sao`}>
                                            {star} sao
                                        </label>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </StarContainer>
                    {errors.rating && <span>{errors.rating.message}</span>}

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
