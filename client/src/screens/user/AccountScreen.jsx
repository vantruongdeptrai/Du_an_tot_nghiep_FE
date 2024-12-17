import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { FormElement, Input } from "../../styles/form";
import { BaseLinkGreen } from "../../styles/button";
import { useForm } from "react-hook-form"; // Import useForm từ react-hook-form
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Loader from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";

const AccountScreenWrapper = styled.main`
    .address-list {
        margin-top: 20px;
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;

        @media (max-width: ${breakpoints.lg}) {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    .address-item {
        border-radius: 12px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 25px;
        row-gap: 8px;
    }

    .address-tags {
        gap: 12px;

        li {
            height: 28px;
            border-radius: 8px;
            padding: 2px 12px;
            background-color: ${defaultTheme.color_whitesmoke};
        }
    }

    .address-btns {
        margin-top: 12px;
        .btn-separator {
            width: 1px;
            border-radius: 50px;
            background: ${defaultTheme.color_platinum};
            margin: 0 10px;
        }
    }
    .button-submit {
        background-color: ${defaultTheme.color_sea_green};
        color: ${defaultTheme.color_white};
        width: 100px;
        height: 35px;
        font-size: 18px;
        border-radius: 8px;
        border: none;
        transition: background-color 0.3s ease;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button-submit:hover {
        background-color: ${defaultTheme.color_sea_green_v1}; /* Màu nền khi hover */
    }
    form {
        display: flex;
        flex-direction: column; /* Đặt các trường form thành cột dọc */
        gap: 20px; /* Khoảng cách giữa các trường */
    }

    .form-elem {
        display: flex;
        flex-direction: column; /* Mỗi trường form cũng là một cột dọc */
        gap: 10px; /* Khoảng cách giữa label và input */
    }

    .form-label {
        font-weight: 600;
        font-size: 14px;
    }

    . {
        display: flex;
        flex-direction: row; /* Các input và nút upload ảnh sẽ nằm ngang */
        align-items: center;
        gap: 10px; /* Khoảng cách giữa ảnh và input */
    }

    .form-elem-control {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 8px;
        width: 100%;
    }
`;

const breadcrumbItems = [
    {
        label: "Trang chủ",
        link: "/",
    },
    { label: "Tài khoản", link: "/account" },
];

const AccountScreen = () => {
    const users = localStorage.getItem("userInfo");
    const { user, updateUser, isLoading } = useUser();
    const nav = useNavigate()
    
    // Khởi tạo useForm từ React Hook Form
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        // Giả sử đây là dữ liệu bạn nhận được từ API hoặc từ trạng thái trước đó

        // Sử dụng setValue để cập nhật các giá trị vào form
        setValue("id", user.id);
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("phone", user.phone);
        // setValue("image", user.image);
    }, [setValue, user]);

    const handleFormSubmit = async (data) => {
        await updateUser({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            // image: data.image[0], // Lấy file đầu tiên từ input file
        });
        toast.success("Cập nhật thành công.");
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         // Xử lý file tải lên, ví dụ gửi file lên server
    //         console.log("Selected file:", file);
    //     }
    // };

    if (!users) {
        return nav("/sign_in");
    }
    if(isLoading) {
        return <p>
            <Loader />
        </p>
    }

    return (
        <AccountScreenWrapper className="page-py-spacing">
            <Container>
                <Breadcrumb items={breadcrumbItems} />
                <UserDashboardWrapper>
                    <UserMenu />
                    <UserContent>
                        <Title titleText={"Tài khoản của tôi"} />
                        <h4 className="title-sm">Thông tin</h4>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className="">
                                <Input
                                    type="hidden"
                                    {...register("id")} // Register cho ảnh đại diện
                                    defaultValue={user.id}
                                />
                                {/* Trường ảnh đại diện */}
                                <FormElement className="form-elem">
                                    {/* <label className="form-label font-semibold text-base">Ảnh cá nhân</label> */}
                                    {/* <div style={{ marginTop: 10 }} className=" flex items-center">
                                        <img
                                            src={
                                                user.image ||
                                                "https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223"
                                            }
                                            alt="Profile Avatar"
                                            style={{
                                                width: "50px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                marginRight: "10px",
                                            }}
                                        />
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            {...register("image")} // Register cho ảnh đại diện
                                            onChange={handleFileChange}
                                        />
                                    </div> */}
                                </FormElement>

                                {/* Trường tên người dùng */}
                                <FormElement className="form-elem">
                                    <label htmlFor="name" className="form-label font-semibold text-base">
                                        Tên tài khoản
                                    </label>
                                    <div style={{ marginTop: 10 }} className=" flex items-center">
                                        <Input
                                            type="text"
                                            className="form-elem-control text-outerspace font-semibold"
                                            {...register("name")} // Đăng ký trường tên
                                        />
                                    </div>
                                </FormElement>

                                {/* Trường email */}
                                <FormElement className="form-elem">
                                    <label htmlFor="email" className="form-label font-semibold text-base">
                                        Địa chỉ Email
                                    </label>
                                    <div style={{ marginTop: 10 }} className=" flex items-center">
                                        <Input
                                            type="email"
                                            className="form-elem-control text-outerspace font-semibold"
                                            {...register("email")} // Đăng ký trường email
                                        />
                                    </div>
                                </FormElement>

                                {/* Trường số điện thoại */}
                                <FormElement className="form-elem">
                                    <label htmlFor="phone" className="form-label font-semibold text-base">
                                        Số điện thoại
                                    </label>
                                    <div style={{ marginTop: 10 }} className=" flex items-center">
                                        <Input
                                            type="text"
                                            className="form-elem-control text-outerspace font-semibold"
                                            defaultValue={user.phone || ""}
                                            {...register("phone")} // Đăng ký trường phone
                                        />
                                    </div>
                                </FormElement>
                            </div>
                            <button className="button-submit" type="submit">
                                Cập nhật
                            </button>
                        </form>
                    </UserContent>
                </UserDashboardWrapper>
            </Container>
        </AccountScreenWrapper>
    );
};

export default AccountScreen;
