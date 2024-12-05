import { HiOutlineLogout } from "react-icons/hi";
import { InputWithLabel, Sidebar, SimpleInput } from "../../components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [inputObject, setInputObject] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [user, setUser] = useState<any>(null); // Dữ liệu người dùng
  const navigate = useNavigate();

  // Lấy thông tin từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Cập nhật dữ liệu vào inputObject nếu cần chỉnh sửa
      setInputObject({
        username: parsedUser.name || "",
        email: parsedUser.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <p>Loading...</p>; // Hiển thị trong lúc load dữ liệu
  }

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin cá nhân
              </h2>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={user.image || "/src/assets/profile.jpg"} // Hiển thị ảnh từ user.image hoặc ảnh mặc định
                  alt="Profile"
                  className="rounded-full w-20 h-20"
                />
                <div>
                  <p className="dark:text-whiteSecondary text-blackPrimary text-xl">
                    {user.name} {/* Hiển thị tên người dùng */}
                  </p>
                  <p className="dark:text-whiteSecondary text-blackPrimary">
                    {user.role?.name === "Role 1"
                      ? "Admin"
                      : user.role?.name || "No role assigned"}
                  </p>
                </div>
              </div>

              {/* Form chỉ hiển thị thông tin */}
              <div className="flex flex-col gap-3 mt-5">
                <InputWithLabel label="Tên của bạn">
                  <SimpleInput
                    type="text"
                    placeholder="Your username"
                    value={inputObject.username}
                    readOnly // Chỉ đọc
                  />
                </InputWithLabel>
                <InputWithLabel label="Email của bạn">
                  <SimpleInput
                    type="text"
                    placeholder="Your email"
                    value={inputObject.email}
                    readOnly // Chỉ đọc
                  />
                </InputWithLabel>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={handleLogout}
                className="dark:bg-red-600 bg-red-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-x-2 hover:bg-red-700 duration-200"
              >
                <HiOutlineLogout className="text-xl" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
