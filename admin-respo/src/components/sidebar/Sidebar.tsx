import {
  HiCash,
  HiCurrencyDollar,
  HiLogin,
  HiOutlineHome,
  HiShieldCheck,
  HiUserGroup,
} from "react-icons/hi";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { HiOutlineTag } from "react-icons/hi";
import { HiOutlineTruck } from "react-icons/hi";
import { HiOutlineStar } from "react-icons/hi";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { HiOutlineX } from "react-icons/hi";
import { setSidebar } from "../../features/dashboard/dashboardSlice";
import { HiOutlineUser } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [isLandingOpen, setIsLandingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { isSidebarOpen } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  // Xác định lớp CSS của sidebar dựa trên trạng thái isSidebarOpen
  const sidebarClass: string = isSidebarOpen
    ? "sidebar-open"
    : "sidebar-closed";

  const navActiveClass: string =
    "block dark:bg-whiteSecondary flex items-center self-stretch gap-4 py-4 px-6 cursor-pointer max-xl:py-3 dark:text-blackPrimary bg-white text-blackPrimary";
  const navInactiveClass: string =
    "block flex items-center self-stretch gap-4 py-4 px-6 dark:bg-blackPrimary dark:hover:bg-blackSecondary cursor-pointer max-xl:py-3 dark:text-whiteSecondary hover:bg-white text-blackPrimary bg-whiteSecondary";

  return (
    <div className="relative">
      <div
        className={`w-72 h-[100vh] dark:bg-blackPrimary bg-whiteSecondary pt-6 xl:sticky xl:top-0 xl:z-10 max-xl:fixed max-xl:top-0 max-xl:z-10 xl:translate-x-0 ${sidebarClass}`}
      >
        <HiOutlineX
          className="dark:text-whiteSecondary text-blackPrimary text-2xl ml-auto mb-2 mr-2 cursor-pointer xl:py-3"
          onClick={() => dispatch(setSidebar())}
        />
        <div>
          <div
            onClick={() => setIsLandingOpen(() => !isLandingOpen)}
            className="block flex items-center self-stretch gap-4 py-4 px-6 dark:bg-blackPrimary dark:hover:bg-blackSecondary cursor-pointer max-xl:py-3 dark:text-whiteSecondary hover:bg-white text-blackPrimary bg-whiteSecondary"
          >
            <HiOutlineHome className="text-xl" />
            <span className="text-lg">Trang đích</span>
          </div>
          {isLandingOpen && (
            <div>
              <NavLink
                to="/"
                className={(isActiveObj) =>
                  isActiveObj.isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineHome className="text-xl" />
                <span className="text-lg">Tổng quan v1</span>
              </NavLink>

              {/* <NavLink
                to="/landing-v2"
                className={(isActiveObj) =>
                  isActiveObj.isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiOutlineHome className="text-xl" />
                <span className="text-lg">Tổng quan v2</span>
              </NavLink> */}
            </div>
          )}

          <NavLink
            to="/products"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineDevicePhoneMobile className="text-xl" />
            <span className="text-lg">Sản phẩm</span>
          </NavLink>
          <NavLink
            to="/categories"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineTag className="text-xl" />
            <span className="text-lg">Danh mục</span>
          </NavLink>
          <NavLink
            to="/orders"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineTruck className="text-xl" />
            <span className="text-lg">Đơn hàng</span>
          </NavLink>
          {/* <NavLink
            to="/permissions"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiShieldCheck className="text-xl" />
            <span className="text-lg">Quyền hạn</span>
          </NavLink> */}
          <NavLink
            to="/coupons"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiCash className="text-xl" />
            <span className="text-lg">Mã giảm giá</span>
          </NavLink>
          {/* <NavLink
            to="/operating-costs"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiCurrencyDollar className="text-xl" />
            <span className="text-lg">Chi phí vận hành</span>
          </NavLink> */}
          <NavLink
            to="/users"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineUser className="text-xl" />
            <span className="text-lg">Người dùng</span>
          </NavLink>
          <NavLink
            to="/reviews"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineStar className="text-xl" />
            <span className="text-lg">Đánh giá</span>
          </NavLink>

          <div
            onClick={() => setIsAuthOpen(() => !isAuthOpen)}
            className="block flex items-center self-stretch gap-4 py-4 px-6 dark:bg-blackPrimary dark:hover:bg-blackSecondary cursor-pointer max-xl:py-3 dark:text-whiteSecondary hover:bg-white text-blackPrimary bg-whiteSecondary"
          >
            <HiUserGroup className="text-xl" />
            <span className="text-lg">Xác thực</span>
          </div>
          {isAuthOpen && (
            <div>
              <NavLink
                to="/login"
                className={(isActiveObj) =>
                  isActiveObj.isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiLogin className="text-xl" />
                <span className="text-lg">Đăng nhập</span>
              </NavLink>
              <NavLink
                to="/register"
                className={(isActiveObj) =>
                  isActiveObj.isActive ? navActiveClass : navInactiveClass
                }
              >
                <HiUserGroup className="text-xl" />
                <span className="text-lg">Đăng ký</span>
              </NavLink>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 border-1 border-t dark:border-blackSecondary border-blackSecondary w-full">
          <NavLink
            to="/help-desk"
            className={(isActiveObj) =>
              isActiveObj.isActive ? navActiveClass : navInactiveClass
            }
          >
            <HiOutlineInformationCircle className="text-xl" />
            <span className="text-lg">Hỗ trợ</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
