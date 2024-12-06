import styled from "styled-components";
import { HeaderMainWrapper, SiteBrandWrapper } from "../../styles/header";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import { navMenuData } from "../../data/data";
import { Link, useLocation } from "react-router-dom";
import { Input, InputGroupWrapper } from "../../styles/form";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/slices/sidebarSlice";
import { useNavigate } from "react-router-dom";
import useSearch from "../../../hooks/search";
import useCart from "../../hooks/useCart";

const NavigationAndSearchWrapper = styled.div`
    column-gap: 20px;
    .search-form {
        @media (max-width: ${breakpoints.lg}) {
            width: 100%;
            max-width: 500px;
        }
        @media (max-width: ${breakpoints.sm}) {
            display: none;
        }
    }

    .input-group {
        min-width: 320px;

        .input-control {
            @media (max-width: ${breakpoints.sm}) {
                display: none;
            }
        }

        @media (max-width: ${breakpoints.xl}) {
            min-width: 160px;
        }

        @media (max-width: ${breakpoints.sm}) {
            min-width: auto;
            grid-template-columns: 100%;
        }
    }

    @media (max-width: ${breakpoints.lg}) {
        width: 100%;
        justify-content: flex-end;
    }
`;

const NavigationMenuWrapper = styled.nav`
    .nav-menu-list {
        margin-left: 20px;

        @media (max-width: ${breakpoints.lg}) {
            flex-direction: column;
        }
    }

    .nav-menu-item {
        margin-right: 20px;
        margin-left: 20px;

        @media (max-width: ${breakpoints.xl}) {
            margin-left: 16px;
            margin-right: 16px;
        }
    }

    .nav-menu-link {
        &.active {
            color: ${defaultTheme.color_outerspace};
            font-weight: 700;
        }

        &:hover {
            color: ${defaultTheme.color_sea_green};
        }
    }

    @media (max-width: ${breakpoints.lg}) {
        position: absolute;
        top: 0;
        right: 0;
        width: 260px;
        background: ${defaultTheme.color_white};
        height: 100%;
        z-index: 999;
        display: none;
    }
`;

const IconLinksWrapper = styled.div`
    column-gap: 18px;
    .icon-link {
        width: 36px;
        height: 36px;
        border-radius: 6px;

        &.active {
            background-color: ${defaultTheme.color_sea_green};
            img {
                filter: brightness(100);
            }
        }

        &:hover {
            background-color: ${defaultTheme.color_whitesmoke};
        }
    }

    @media (max-width: ${breakpoints.xl}) {
        column-gap: 8px;
    }

    @media (max-width: ${breakpoints.xl}) {
        column-gap: 6px;
    }
`;
const UserDropdownWrapper = styled.div`
    position: relative;
    display: inline-block;
    height: 25px;

    .avatar-btn {
        background: none;
        border: none;
        cursor: pointer;
    }

    .dropdown-content {
        visibility: hidden;
        opacity: 0;
        position: absolute;
        right: 0;
        top: 40px;
        background-color: ${defaultTheme.color_white};
        min-width: 180px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1;
        border-radius: 6px;
        overflow: hidden;
        transition: opacity 0.3s ease, visibility 0s 0.3s;

        a {
            color: ${defaultTheme.color_outerspace};
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            font-size: 14px;

            &:hover {
                background-color: ${defaultTheme.color_light_gray};
                color: ${defaultTheme.color_sea_green}; /* Hoặc màu khác nếu muốn */
            }
        }
    }

    &:hover .dropdown-content {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
    }

    /* Thêm hover vào các mục con */
    .dropdown-content a:hover {
        background-color: ${defaultTheme.color_sea_green}; /* Màu nền khi hover */
        color: ${defaultTheme.color_white}; /* Màu chữ khi hover */
    }
`;


const Header = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { keyword, setKeyword } = useSearch();
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const userId = user?.id;
    const { carts = { cart: [] } } = useCart(userId);
    console.log(carts);

    const filteredCartItems = carts?.cart?.filter((item) => item.deleted_at == null);
    const cartLocalStorage = JSON.parse(localStorage.getItem("cart"));
    const cartLength = user ? filteredCartItems?.length : cartLocalStorage?.length;
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?name=${keyword}`);
    };
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
    };
    const handleUserClick = () => {
        if (!user) {
            navigate("/sign_in"); // Điều hướng tới trang đăng nhập
        }
    };
    return (
        <HeaderMainWrapper className="header flex items-center">
            <Container className="container">
                <div className="header-wrap flex items-center justify-between">
                    <div className="flex items-center">
                        <button type="button" className="sidebar-toggler" onClick={() => dispatch(toggleSidebar())}>
                            <i className="bi bi-list"></i>
                        </button>
                        <SiteBrandWrapper to="/" className="inline-flex">
                            <div className="brand-img-wrap flex items-center justify-center">
                                <img className="site-brand-img" src={staticImages.logo} alt="site logo" />
                            </div>
                            <span className="site-brand-text text-outerspace">DANDAN</span>
                        </SiteBrandWrapper>
                    </div>
                    <NavigationAndSearchWrapper className="flex items-center">
                        <NavigationMenuWrapper>
                            <ul className="nav-menu-list flex items-center">
                                {navMenuData?.map((menu, index) => {
                                    return (
                                        <li className="nav-menu-item" key={index}>
                                            <Link
                                                to={menu.menuLink}
                                                className="nav-menu-link text-base font-medium text-gray"
                                            >
                                                {menu.menuText}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </NavigationMenuWrapper>
                        <form className="search-form" onSubmit={handleSubmit}>
                            <InputGroupWrapper className="input-group">
                                <span className="input-icon flex items-center justify-center text-xl text-gray">
                                    <i className="bi bi-search"></i>
                                </span>
                                <Input
                                    type="text"
                                    className="input-control w-full"
                                    placeholder="Tìm kiếm tên sản phẩm"
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </InputGroupWrapper>
                        </form>
                    </NavigationAndSearchWrapper>

                    <IconLinksWrapper style={{ alignItems: "center", gap: 25 }} className="flex items-center">
                        {/* <Link
                            to="/wishlist"
                            className={`icon-link ${
                                location.pathname === "/wishlist" ? "active" : ""
                            } inline-flex items-center justify-center`}
                        >
                            <img src={staticImages.heart} alt="" />
                        </Link> */}
                        <UserDropdownWrapper>
                            <button className="flex" style={{alignItems: "center" ,border: "1px solid #ccc", padding: 3, borderRadius: 50}} onClick={handleUserClick}>
                                <img
                                    style={{width: "25px", height: "25px", objectFit: "contain", }}
                                    src={
                                        user
                                            ? "https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223"
                                              
                                            : staticImages.user
                                    }
                                    alt="user avatar"
                                />
                            </button>
                            {user && (
                                <div className="dropdown-content">
                                    <Link to="/order">Đơn hàng của tôi</Link>
                                    <Link to="/cart">Giỏ hàng của tôi</Link>
                                    <Link to="/account">Hồ sơ cá nhân</Link>
                                    <Link to="/sign_in" onClick={() => handleLogout()}>
                                        Đăng xuất
                                    </Link>
                                </div>
                            )}
                        </UserDropdownWrapper>
                        <Link
                            style={{ position: "relative" }}
                            to={"/cart"}
                            className={`icon-link ${
                                location.pathname === "/cart" ? "active" : ""
                            } inline-flex items-center justify-center`}
                        >
                            <img style={{height: "25px" , width: "25px"}} src={staticImages.cart} alt="" />
                            <span
                                style={{
                                    position: "absolute",
                                    top: -5,
                                    right: -10,
                                    color: "white",
                                    width: 20,
                                    background: `${defaultTheme.color_dim_gray}`,
                                    borderRadius: "100%",
                                    textAlign: "center",
                                }}
                                className="cart-item-count"
                            >
                                {cartLength}
                            </span>
                        </Link>
                    </IconLinksWrapper>
                </div>
            </Container>
        </HeaderMainWrapper>
    );
};

export default Header;
