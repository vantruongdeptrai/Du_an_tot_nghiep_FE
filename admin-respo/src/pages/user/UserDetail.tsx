import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

type Props = {};

interface User {
  id: number;
  name: string;
  image: string;
  role_id: number;
  phone: string;
  address: string;
  status: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

const UserDetail = (props: Props) => {
  const { id } = useParams(); // Lấy ID người dùng từ URL
  const [user, setUser] = useState<User | null>(null); // Lưu dữ liệu người dùng
  const [loading, setLoading] = useState<boolean>(true); // Biến trạng thái loading

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  // Hàm để lấy tên quyền (Admin/User)
  const getRole = (role_id: number) => {
    return role_id === 1 ? "Admin" : "User";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Thông tin người dùng
          </h2>
          <div className="flex items-center mb-4">
            {/* <img
              src={user.image}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover mr-4"
            /> */}
            <div>
              <div className="text-lg text-gray-700 font-medium">
                <strong className="text-gray-600">Tên người dùng </strong>
                {user.name}
              </div>
              <div className="text-sm text-gray-500">
                <strong className="text-gray-600">Quyền </strong>
                {getRole(user.role_id)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <strong className="text-gray-600">Số điện thoại: </strong>
              <span>{user.phone}</span>
            </div>
            <div>
              <strong className="text-gray-600">Địa chỉ: </strong>
              <span>{user.address}</span>
            </div>
            <div>
              <strong className="text-gray-600">Trạng thái tài khoản: </strong>
              <span
                className={
                  user.status === "active" ? "text-green-500" : "text-red-500"
                }
              >
                {user.status}
              </span>
            </div>
            <div>
              <strong className="text-gray-600">Email: </strong>
              <span>{user.email}</span>
            </div>
            {/* <div>
              <strong className="text-gray-600">Email đã xác thực vào: </strong>
              <span>{new Date(user.email_verified_at).toLocaleString()}</span>
            </div>
            <div>
              <strong className="text-gray-600">Ngày tạo tài khoản: </strong>
              <span>{new Date(user.created_at).toLocaleString()}</span>
            </div>
            <div>
              <strong className="text-gray-600">Ngày cập nhật: </strong>
              <span>{new Date(user.updated_at).toLocaleString()}</span>
            </div> */}
          </div>
        </div>
      ) : (
        <div>User not found.</div>
      )}
    </div>
  );
};

export default UserDetail;
