import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { HiOutlineEye } from "react-icons/hi";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  role_id: string;
  lastLogin: string;
  image?: string;
};

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(
          "http://127.0.0.1:8000/api/users"
        );
        setUsers(response.data); // Đảm bảo API trả về dữ liệu phù hợp
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-4/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
      </colgroup>
      <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th
            scope="col"
            className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
          >
            Tên người dùng
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Địa chỉ email
          </th>
          <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
            Quyền
          </th>
          <th
            scope="col"
            className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8"
          >
            Hành động
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {users.map((user) => (
          <tr key={user.id}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                <img
                  src={user.image || "https://via.placeholder.com/32"}
                  alt=""
                  className="h-8 w-8 rounded-full bg-gray-800"
                />
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {user.name}
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 table-cell">
              <div className="text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                {user.email}
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm leading-6 sm:pr-8 lg:pr-20">
              <div className="dark:text-whiteSecondary text-blackPrimary font-medium">
                {user.role_id === "1" ? "Admin" : "User"}
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell sm:pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link
                  to={`/users/${user.id}/edit`}
                  className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                >
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <Link
                  to={`/users/${user.id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                >
                  <HiOutlineEye className="text-lg" />
                </Link>
                <button
                  onClick={() => console.log(`Delete user ${user.id}`)}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
