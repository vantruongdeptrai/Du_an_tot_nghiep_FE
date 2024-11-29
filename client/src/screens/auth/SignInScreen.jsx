import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import { FormElement } from "../../styles/form";
import { Form, Link } from "react-router-dom";
import { BaseButtonBlack } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import useLogin from "../../../hooks/account";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const SignInScreenWrapper = styled.section`
    .form-separator {
        margin: 32px 0;
        column-gap: 18px;

        @media (max-width: ${breakpoints.lg}) {
            margin: 24px 0;
        }

        .separator-text {
            border-radius: 50%;
            min-width: 36px;
            height: 36px;
            background-color: ${defaultTheme.color_purple};
            position: relative;
        }

        .separator-line {
            width: 100%;
            height: 1px;
            background-color: ${defaultTheme.color_platinum};
        }
    }

    .form-elem-text {
        margin-top: -16px;
        display: block;
    }

    .error-message {
        color: red;
        font-size: 12px;
        margin-top: 5px;
    }
`;

const SignInScreen = () => {
    const { handleLogin, loading, error } = useLogin();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState(null); // To manage form-level errors
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.role_id === 1) {
                localStorage.removeItem("userInfo");
                toast.error("Đăng nhập không thành công");
            } else {
                navigate("/account");
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if both fields are filled
        if (!identifier || !password) {
            setFormError("Both fields are required.");
            return; // Prevent form submission if fields are empty
        }

        // Reset error if fields are filled
        setFormError(null);

        const userData = await handleLogin(identifier, password);
        console.log(userData);

        if (userData) {
            if (userData.role_id === 1) {
                toast.error("Đăng nhập không thành công");
                return;
            }

            localStorage.setItem("userInfo", JSON.stringify(userData));
            toast.success("Đăng nhập thành công!");

            setTimeout(() => {
                navigate("/");
            }, 200);
        } else if (error) {
            toast.error(error);
        }
    };

    return (
        <SignInScreenWrapper>
            <FormGridWrapper>
                <Container>
                    <div className="form-grid-content">
                        <div className="form-grid-left">
                            <img src={staticImages.form_img1} className="object-fit-cover" />
                        </div>
                        <div className="form-grid-right">
                            <FormTitle>
                                <h3>Sign In</h3>
                                <p className="text-base">Sign in for free to access to any of our products</p>
                            </FormTitle>



                            <form onSubmit={handleSubmit}>
                                <FormElement>
                                    <label htmlFor="" className="form-elem-label">
                                        User name or email address
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập email hoặc số điện thoại"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="form-elem-control"
                                    />
                                    {formError && !identifier && (
                                        <span className="error-message">This field is required</span>
                                    )}
                                </FormElement>
                                <FormElement>
                                    <label htmlFor="" className="form-elem-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        className="form-elem-control"
                                    />
                                    {formError && !password && (
                                        <span className="error-message">This field is required</span>
                                    )}
                                </FormElement>
                                <Link to="/reset" className="form-elem-text text-end font-medium">
                                    Forgot your password?
                                </Link>
                                <BaseButtonBlack type="submit" className="form-submit-btn">
                                    Sign in
                                </BaseButtonBlack>
                            </form>
                            <p className="flex flex-wrap account-rel-text">
                                Don&apos;t have an account?
                                <Link to="/sign_up" className="font-medium">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </Container>
            </FormGridWrapper>
        </SignInScreenWrapper>
    );
};

export default SignInScreen;
