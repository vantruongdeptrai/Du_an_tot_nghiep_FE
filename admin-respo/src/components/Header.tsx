import { FaReact } from "react-icons/fa6";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { HiOutlineBell } from "react-icons/hi";
import { HiOutlineMenu } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import { toggleDarkMode } from "../features/darkMode/darkModeSlice";
import { useEffect, useState } from "react";

const Header = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.darkMode);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user); // Chuyển chuỗi JSON thành object
      setUserInfo({
        name: parsedUser.name,
        role: parsedUser.role_id === 1 ? "Admin" : "User",
      });
      setIsLoggedIn(true);
      console.log("User is logged in:", parsedUser.name);
    } else {
      setIsLoggedIn(false);
      console.log("User is not logged in.");
    }
  }, []);

  return (
    <header className="dark:bg-blackPrimary bg-whiteSecondary relative">
      <div className="flex justify-between items-center px-9 py-5 max-xl:flex-col max-xl:gap-y-7 max-[400px]:px-4">
        <HiOutlineMenu
          className="text-2xl dark:text-whiteSecondary text-blackPrimary absolute bottom-7 left-5 xl:hidden max-sm:static max-sm:order-1 cursor-pointer"
          onClick={() => dispatch(setSidebar())}
        />
        <Link to="/">
          <FaReact className="text-4xl dark:text-whiteSecondary text-blackPrimary hover:rotate-180 hover:duration-1000 hover:ease-in-out cursor-pointer" />
        </Link>
        <SearchInput />
        <div className="flex gap-4 items-center max-xl:justify-center">
          {/* <span className="dark:text-whiteSecondary text-blackPrimary">EN</span> */}
          {darkMode ? (
            <HiOutlineSun
              onClick={() => dispatch(toggleDarkMode())}
              className="text-xl dark:text-whiteSecondary text-blackPrimary cursor-pointer"
            />
          ) : (
            <HiOutlineMoon
              onClick={() => dispatch(toggleDarkMode())}
              className="text-xl dark:text-whiteSecondary text-blackPrimary cursor-pointer"
            />
          )}
          {/* <Link to="/notifications">
            <HiOutlineBell className="text-xl dark:text-whiteSecondary text-blackPrimary" />
          </Link> */}
          <Link to={isLoggedIn ? "/profile" : "/login"}>
            <div className="flex gap-2 items-center">
              <img
                src="/src/assets/profile.jpg"
                alt="profile"
                className="rounded-full w-10 h-10"
              />
              <div className="flex flex-col">
                {userInfo ? (
                  <>
                    <p className="dark:text-whiteSecondary text-blackPrimary text-base max-xl:text-sm">
                      {userInfo.name}
                    </p>
                    <p className="dark:text-whiteSecondary text-blackPrimary text-sm max-xl:text-xs">
                      {userInfo.role}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="dark:text-whiteSecondary text-blackPrimary text-base max-xl:text-sm">
                      Khách
                    </p>
                  </>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
