import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
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
    return <div>Loading...</div>;
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
      <thead className="border-b border-gray-200 bg-gray-50 text-sm leading-6 text-black">
        <tr>
          <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
            Tên người dùng
          </th>
          <th className="py-2 pl-0 pr-8 font-semibold">Địa chỉ email</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Quyền</th>
          <th className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-6 lg:pr-8">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50">
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                {/* <img
                  src={user.image || "https://via.placeholder.com/32"}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                /> */}
                <div className="truncate text-sm font-medium">{user.name}</div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-8">
              <div className="text-sm">{user.email}</div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm">
              <div className="font-medium">
                {user.role_id == "1" ? "Admin" : "User"}
              </div>
            </td>
            <td className="py-4 pl-0 pr-4 text-right text-sm">
              <div className="flex gap-x-2 justify-end">
                {/* <Link
                  to={`/users/${user.id}/edit`}
                  className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  <HiOutlinePencil className="text-lg" />
                </Link> */}
                <Link
                  to={`/users/detail/${user.id}`}
                  className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  <HiOutlineEye className="text-lg" />
                </Link>
                {/* <button
                  onClick={() => console.log(`Delete user ${user.id}`)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  <HiOutlineTrash className="text-lg" />
                </button> */}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
