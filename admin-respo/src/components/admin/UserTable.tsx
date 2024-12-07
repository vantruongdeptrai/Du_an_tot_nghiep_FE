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
                const response = await axios.get<User[]>("http://127.0.0.1:8000/api/users");
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
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Tên người dùng
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Địa chỉ email
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Quyền
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Hành động
                    </th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {user.name}
                        </th>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.role_id == "1" ? "Admin" : "User"}</td>
                        <td className="px-6 py-4">
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
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;
