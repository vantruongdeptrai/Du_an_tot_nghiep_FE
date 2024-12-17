import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import PasswordInput from "../../components/auth/PasswordInput";
import { BaseButtonBlack } from "../../styles/button";
import { useForm } from "react-hook-form";
import axios from "axios"; // Thêm axios để gọi API
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChangePwdScreenWrapper = styled.section``;

const ChangePasswordScreen = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const nav = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch, // Dùng để xem giá trị trường new_password và confirm_password
    } = useForm();

    // Hàm xử lý submit
    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/update-password/${user?.id}`, // Thay đổi URL theo API thực tế
                {
                    current_password: data.current_password,
                    new_password: data.new_password,
                    new_password_confirmation: data.new_password_confirmation,
                }
            );
            nav("/")
            toast.success("Đổi mật khẩu thành công.");

            console.log("Password updated successfully", response.data);
            // Xử lý thêm sau khi đổi mật khẩu thành công, ví dụ thông báo, redirect,...
        } catch (error) {
            console.error("Failed to update password:", error);
            toast.error("Lỗi khi đổi mật khẩu!");
            // Hiển thị thông báo lỗi nếu có
        }
    };

    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có trùng khớp không
    const newPassword = watch("new_password");

    return (
        <ChangePwdScreenWrapper>
            <FormGridWrapper>
                <Container>
                    <div className="form-grid-content">
                        <div className="form-grid-left">
                            <img src={staticImages.form_img5} className="object-fit-cover" alt="" />
                        </div>
                        <div className="form-grid-right">
                            <FormTitle>
                                <h3>Đổi mật khẩu</h3>
                                <p>Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đó.</p>
                            </FormTitle>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Current Password */}
                                <PasswordInput
                                    fieldName="Mật khẩu hiện tại"
                                    name="current_password"
                                    register={register}
                                    required="Mật khẩu hiện tại bắt buộc nhập"
                                    errorMsg={errors.current_password?.message}
                                />

                                {/* New Password */}
                                <PasswordInput
                                    fieldName="Mật khẩu mới"
                                    name="new_password"
                                    register={register}
                                    required="Mật khẩu mới bắt buộc"
                                    errorMsg={errors.new_password?.message}
                                />

                                {/* Confirm New Password */}
                                <PasswordInput
                                    fieldName="Nhập lại mật khẩu mới"
                                    name="new_password_confirmation"
                                    register={register}
                                    required="Nhập lại mật khẩu mới bắt buộc"
                                    errorMsg={errors.new_password_confirmation?.message}
                                    validate={(value) => value === newPassword || "Mật khẩu không trùng khớp!"}
                                />

                                <BaseButtonBlack type="submit" className="form-submit-btn">
                                    Đổi mật khẩu
                                </BaseButtonBlack>
                            </form>
                        </div>
                    </div>
                </Container>
            </FormGridWrapper>
        </ChangePwdScreenWrapper>
    );
};

export default ChangePasswordScreen;
