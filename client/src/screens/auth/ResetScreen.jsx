import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import { FormElement, Input } from "../../styles/form";
import { BaseButtonBlack } from "../../styles/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import apiClient from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ResetScreenWrapper = styled.div``;

const ResetScreen = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem("userInfo");
        if (user) {
            // Nếu đã đăng nhập, chuyển hướng về trang chủ
            navigate("/");
        }
    }, [navigate]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const forgotPassword = async (data) => {
        await apiClient.post("/forgot-password", data);
    };

    const onSubmit = (data) => {
        forgotPassword(data);
        navigate("/sign_in");
        toast.success("Gửi thành công.");
    };
    return (
        <ResetScreenWrapper>
            <FormGridWrapper>
                <Container>
                    <div className="form-grid-content">
                        <div className="form-grid-left">
                            <img src={staticImages.form_img3} className="object-fit-cover" />
                        </div>
                        <div className="form-grid-right">
                            <FormTitle>
                                <h3>Đặt lại mật khẩu của bạn</h3>
                                <p>Nhập email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.</p>
                                <p>Vui lòng kiểm tra lại.</p>
                            </FormTitle>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FormElement>
                                    <label htmlFor="" className="form-elem-label">
                                        Email
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Nhập email..."
                                        {...register("email")}
                                        className="form-elem-control"
                                    />
                                </FormElement>
                                <BaseButtonBlack type="submit" className="form-submit-btn">
                                    Gửi
                                </BaseButtonBlack>
                            </form>
                            <p className="flex flex-wrap account-rel-text">
                                <Link to="/sign_in" className="font-medium">
                                    Quay lại trang đăng nhập.
                                </Link>
                            </p>
                        </div>
                    </div>
                </Container>
            </FormGridWrapper>
        </ResetScreenWrapper>
    );
};

export default ResetScreen;
