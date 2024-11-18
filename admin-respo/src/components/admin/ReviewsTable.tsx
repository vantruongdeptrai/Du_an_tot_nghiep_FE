import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiStar,
} from "react-icons/hi";

// Định nghĩa kiểu dữ liệu cho một comment
interface Comment {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

// Function to render stars based on the rating (nếu cần)
const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<HiStar key={i} className="text-yellow-500" />);
  }
  return stars;
};

const ReviewsTable = () => {
  const [reviews, setReviews] = useState<Comment[]>([]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/comments`);
        const data: Comment[] = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Function to handle delete with confirmation and perform deletion
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
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
          alert("Review deleted successfully!");
          setReviews((prev) => prev.filter((review) => review.id !== id));
        } else {
          alert("Failed to delete the review. Response not OK.");
          console.log("Response:", await response.json());
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("An error occurred while deleting the review.");
      }
    }
  };

  return (
    <table className="mt-6 w-full text-sm text-gray-700 bg-white rounded-lg shadow-md overflow-hidden table-fixed">
      <colgroup>
        <col className="w-2/12" />
        <col className="w-4/12" />
        <col className="w-2/12" />
        <col className="w-2/12" />
        <col className="w-2/12" />
      </colgroup>
      <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm">
        <tr>
          <th scope="col" className="py-3 px-4 font-semibold text-center">
            User ID
          </th>
          <th scope="col" className="py-3 px-4 font-semibold text-left">
            Comment
          </th>
          <th scope="col" className="py-3 px-4 font-semibold text-center">
            Product ID
          </th>
          <th scope="col" className="py-3 px-4 font-semibold text-center">
            Created At
          </th>
          <th scope="col" className="py-3 px-4 font-semibold text-center">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {reviews.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4 text-center">
              <div className="text-gray-800 font-medium">{item.user_id}</div>
            </td>
            <td className="py-4 px-4 text-left">
              <div className="bg-gray-100 p-2 rounded-md text-gray-700">
                {item.comment}
              </div>
            </td>
            <td className="py-4 px-4 text-center text-gray-800 font-medium">
              {item.product_id}
            </td>
            <td className="py-4 px-4 text-center text-gray-600">
              {new Date(item.created_at).toLocaleDateString()}
            </td>
            <td className="py-4 px-4 text-center">
              <div className="flex gap-2 justify-center">
                {/* <Link
                  to={`/reviews/${item.id}`}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  <HiOutlineEye />
                </Link>
                <Link
                  to={`/reviews/${item.id}/edit`}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  <HiOutlinePencil />
                </Link> */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReviewsTable;
