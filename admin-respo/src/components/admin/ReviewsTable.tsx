import { useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { toast } from "react-toastify";

// Define types for comment, user, and product
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

// Render stars based on rating
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
  const [replyContent, setReplyContent] = useState<string>(""); // Store reply content
  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(
    null
  ); // Store the ID of the comment being replied to

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const totalReviews = reviews.length;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

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

  // Handle delete comment
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
          toast.success("Xóa bình luận thành công!");
          setReviews((prev) => prev.filter((review) => review.id !== id));
        } else {
          toast.error("Xóa bình luận không thành công.");
          console.log("Lỗi:", await response.json());
        }
      } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        alert("Đã xảy ra lỗi khi xóa bình luận.");
      }
    }
  };

  // Handle reply to comment
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
        setReplyContent(""); // Clear the content after reply
        setReplyingCommentId(null); // Reset reply status
      } else {
        alert("Không thể gửi trả lời.");
        console.log("Lỗi:", await response.json());
      }
    } catch (error) {
      console.error("Lỗi khi trả lời:", error);
      alert("Đã xảy ra lỗi khi trả lời bình luận.");
    }
  };

  // Get current reviews based on the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
          {currentReviews.map((item) => (
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <nav aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <button
                onClick={handlePreviousPage}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                disabled={currentPage === 1}
              >
                Trước
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === index + 1 ? "text-blue-600 bg-blue-50" : ""
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleNextPage}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      </div>

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
