import { useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";

// Định nghĩa kiểu dữ liệu cho comment, người dùng, và sản phẩm
interface Comment {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  rating: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

const getUserName = (userId: number, users: User[]) => {
  const user = users.find((user) => user.id === userId);
  return user ? user.name : "Không rõ";
};

const getProductName = (productId: number, products: Product[]) => {
  const product = products.find((product) => product.id === productId);
  return product ? product.name : "Không rõ";
};

// Hàm để hiển thị sao dựa trên rating
const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-300" : "text-gray-300"
        } ms-1`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
      </svg>
    );
  }
  return stars;
};

const ReviewsTable = () => {
  const [reviews, setReviews] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [replyContent, setReplyContent] = useState<string>(""); // Lưu nội dung trả lời
  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(
    null
  ); // Lưu ID của bình luận đang trả lời

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsResponse = await fetch(
          "http://127.0.0.1:8000/api/comments"
        );
        const reviewsData: Comment[] = await reviewsResponse.json();
        setReviews(reviewsData);

        const usersResponse = await fetch("http://127.0.0.1:8000/api/users");
        const usersData: User[] = await usersResponse.json();
        setUsers(usersData);

        const productsResponse = await fetch(
          "http://127.0.0.1:8000/api/products"
        );
        const productsData: Product[] = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  // Hàm xử lý xóa bình luận
  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/comments/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          alert("Xóa bình luận thành công!");
          setReviews((prev) => prev.filter((review) => review.id !== id));
        } else {
          alert("Xóa bình luận không thành công.");
          console.log("Lỗi:", await response.json());
        }
      } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        alert("Đã xảy ra lỗi khi xóa bình luận.");
      }
    }
  };

  // Hàm xử lý gửi trả lời
  const handleReply = async () => {
    if (!replyContent || replyingCommentId === null) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/${replyingCommentId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: replyContent }),
        }
      );

      if (response.ok) {
        alert("Trả lời thành công!");
        setReplyContent(""); // Xóa nội dung sau khi gửi
        setReplyingCommentId(null); // Hủy trạng thái đang trả lời
      } else {
        alert("Không thể gửi trả lời.");
        console.log("Lỗi:", await response.json());
      }
    } catch (error) {
      console.error("Lỗi khi trả lời:", error);
      alert("Đã xảy ra lỗi khi trả lời bình luận.");
    }
  };

  return (
    <div>
      <table className="mt-6 w-full text-sm text-gray-700 bg-white rounded-lg shadow-md overflow-hidden table-fixed">
        <colgroup>
          <col className="w-2/12" />
          <col className="w-2/12" />
          <col className="w-1/12" />
          <col className="w-2/12" />
          <col className="w-2/12" />
        </colgroup>
        <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm">
          <tr>
            <th scope="col" className="py-3 px-4 font-semibold text-center">
              Tên người dùng
            </th>
            <th scope="col" className="py-3 px-4 font-semibold text-left">
              Bình luận
            </th>
            <th scope="col" className="py-3 px-4 font-semibold text-center">
              Đánh giá
            </th>
            <th scope="col" className="py-3 px-4 font-semibold text-center">
              Tên sản phẩm
            </th>
            <th scope="col" className="py-3 px-4 font-semibold text-center">
              Thời điểm
            </th>
            <th scope="col" className="py-3 px-4 font-semibold text-center">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reviews.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-center">
                <div className="text-gray-800 font-medium">
                  {getUserName(item.user_id, users)}
                </div>
              </td>
              <td className="py-4 px-4 text-left">
                <div className="bg-gray-100 p-2 rounded-md text-gray-700">
                  {item.comment}
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center">
                  {renderStars(item.rating)}
                </div>
              </td>
              <td className="py-4 px-4 text-center text-gray-800 font-medium">
                {getProductName(item.product_id, products)}
              </td>
              <td className="py-4 px-4 text-center text-gray-600">
                {new Date(item.created_at).toLocaleDateString()}
              </td>

              <td className="py-4 px-4 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Xóa
                  </button>
                  {/* <button
                    onClick={() => setReplyingCommentId(item.id)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Trả lời
                  </button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form trả lời */}
      {replyingCommentId !== null && (
        <div className="mt-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Nhập trả lời..."
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleReply}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Gửi trả lời
            </button>
            <button
              onClick={() => setReplyingCommentId(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsTable;
