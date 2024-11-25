import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import PasswordInput from "../../components/auth/PasswordInput";
import { BaseButtonBlack } from "../../styles/button";
import { useForm } from "react-hook-form";

const ChangePwdScreenWrapper = styled.section``;

const ChangePasswordScreen = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Xử lý dữ liệu form khi submit
  };

  return (
    <ChangePwdScreenWrapper>
      <FormGridWrapper>
        <Container>
          <div className="form-grid-content">
            <div className="form-grid-left">
              <img
                src={staticImages.form_img5}
                className="object-fit-cover"
                alt=""
              />
            </div>
            <div className="form-grid-right">
              <FormTitle>
                <h3>Create New Password</h3>
                <p>
                  Your new password must be different from previous used
                  passwords.
                </p>
              </FormTitle>
              <form onSubmit={handleSubmit(onSubmit)}>
                <PasswordInput
                  fieldName="Password"
                  name="password"
                  register={register}
                  required="Password is required"
                  errorMsg={errors.password?.message}
                />
                <PasswordInput
                  fieldName="Confirm Password"
                  name="confirm_password"
                  register={register}
                  required="Confirm password is required"
                  errorMsg={errors.confirm_password?.message}
                />
                <BaseButtonBlack type="submit" className="form-submit-btn">
                  Reset Password
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
