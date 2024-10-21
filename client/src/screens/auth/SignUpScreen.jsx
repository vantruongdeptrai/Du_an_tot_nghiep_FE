import styled from "styled-components";
import { CheckboxGroup, FormGridWrapper, FormTitle } from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import AuthOptions from "../../components/auth/AuthOptions";
import { FormElement } from "../../styles/form";
import { Link, useNavigate } from "react-router-dom";
import { BaseButtonBlack } from "../../styles/button";
import PasswordInput from "../../components/auth/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validations/Auth";
import useAuth from "../../hooks/useRegister";

const SignUpScreenWrapper = styled.section`
    form {
        margin-top: 40px;
        .form-elem-text {
            margin-top: -16px;
            display: block;
        }
    }

    .text-space {
        margin: 0 4px;
    }
`;

const SignUpScreen = () => {
    const { registerUser } = useAuth();
    const nav = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data) => {
        console.log(data);
        registerUser(data);
        nav("/sign_in");
    };
    return (
        <SignUpScreenWrapper>
            <FormGridWrapper>
                <Container>
                    <div className="form-grid-content">
                        <div className="form-grid-left">
                            <img src={staticImages.form_img2} className="object-fit-cover" alt="" />
                        </div>
                        <div className="form-grid-right">
                            <FormTitle>
                                <h3>Sign Up</h3>
                                <p className="text-base">Sign up for free to access to in any of our products</p>
                            </FormTitle>
                            <AuthOptions />
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FormElement>
                                    <div>
                                        <label htmlFor="" className="forme-elem-label">
                                            User name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="UserName..."
                                            {...register("name")}
                                            className="form-elem-control"
                                        />
                                        {errors.name && <span className="form-elem-error">{errors.name.message}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="" className="forme-elem-label">
                                            User name or email address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="Email address..."
                                            {...register("email", { required: true })}
                                            className="form-elem-control"
                                        />
                                        {errors.email && (
                                            <span className="form-elem-error">{errors.email.message}</span>
                                        )}
                                    </div>

                                    <div>
                                        <PasswordInput
                                            fieldName="Password"
                                            name="password"
                                            errorMsg={errors.password?.message}
                                            register={register}
                                        />
                                    </div>
                                    <div>
                                        <PasswordInput
                                            fieldName="Password Confirmation"
                                            name="password_confirmation"
                                            errorMsg={errors.password_confirmation?.message}
                                            register={register}
                                        />
                                    </div>
                                </FormElement>

                                <span className="form-elem-text font-medium">
                                    Use 8 or more characters with a mix of letters, numbers & symbols
                                </span>

                                <CheckboxGroup>
                                    <li className="flex items-center">
                                        <input type="checkbox" />
                                        <span className="text-sm">
                                            Agree to our
                                            <Link to="/" className="text-underline">
                                                Terms of use
                                            </Link>
                                            <span className="text-space">and</span>
                                            <Link to="/" className="text-underline">
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <input type="checkbox" />
                                        <span className="text-sm">Subscribe to our monthly newsletter</span>
                                    </li>
                                </CheckboxGroup>
                                <BaseButtonBlack type="submit" className="form-submit-btn">
                                    Sign Up
                                </BaseButtonBlack>
                            </form>
                            <p className="flex flex-wrap account-rel-text">
                                Already have an account?
                                <Link to="/sign_in" className="font-medium">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </Container>
            </FormGridWrapper>
        </SignUpScreenWrapper>
    );
};

export default SignUpScreen;
