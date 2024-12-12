// import { useState, useEffect } from 'react';

// // Hook để lấy danh sách đơn hàng với phân trang
// export const usePagination = ({ page = 1, limit = 20 }: { page: number, limit: number }) => {
//     const [data, setData] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [isError, setIsError] = useState<boolean>(false);

//     useEffect(() => {
//         const fetchData = async () => {
//             setIsLoading(true);
//             setIsError(false);

//             try {
//                 const response = await fetch(`http://localhost:8000/api/orders?page=${page}&limit=${limit}`);
                
//                 if (response.ok) {
//                     const result = await response.json();
//                     setData(result); // Cập nhật dữ liệu từ API
//                 } else {
//                     setIsError(true); // Xử lý lỗi nếu không thành công
//                 }
//             } catch (error) {
//                 console.error('Error fetching orders:', error);
//                 setIsError(true); // Xử lý lỗi nếu gặp sự cố mạng
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, [page, limit]); // Hook sẽ gọi lại API khi `page` hoặc `limit` thay đổi

//     return { data, isLoading, isError };
// };