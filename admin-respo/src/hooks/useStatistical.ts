import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useStats = () => {

    // Hàm lấy tổng doanh thu
    const fetchTotalRevenue = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/total-revenue");
            return response.data;
        } catch (error) {
            console.error("Error fetching total revenue:", error);
        }
    };

    // Hàm lấy các sản phẩm bán chạy nhất
    const fetchBestSellers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/products/best-sellers");
            return response.data;
        } catch (error) {
            console.error("Error fetching best sellers:", error);
        }
    };

    // Hàm lấy doanh thu theo năm
    const fetchYearlyRevenue = async (year: string) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revenue/year?year=${year}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching yearly revenue:", error);
        }
    };

    // Hàm lấy doanh thu theo ngày
    const fetchDailyRevenue = async (date: string) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revenue/day?date=${date}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching daily revenue:", error);
        }
    };

    // Hàm lấy doanh thu theo tháng
    const fetchMonthlyRevenue = async (year: string) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revenue/months?year=${year}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching monthly revenue:", error);
        }
    };

    // Hàm lấy doanh thu theo danh mục
    const fetchRevenueByCategory = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/revenue-by-category");
            return response.data;
        } catch (error) {
            console.error("Error fetching revenue by category:", error);
        }
    };

    // Hàm lấy thống kê đơn hàng
    const fetchOrderStats = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/order-stats");
            return response.data;
        } catch (error) {
            console.error("Error fetching order stats:", error);
        }
    };

    // Hàm lấy sản phẩm đã bán
    const fetchSoldProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/revenue/sold-products");
            return response.data;
        } catch (error) {
            console.error("Error fetching sold products:", error);
        }
    };

    // Query cho tổng doanh thu
    const { data: totalRevenue } = useQuery(['totalRevenue'], fetchTotalRevenue);

    // Query cho sản phẩm bán chạy nhất
    const { data: bestSellers } = useQuery(['bestSellers'], fetchBestSellers);

    // Query cho doanh thu theo năm (cần cung cấp tham số `year`)
    const { data: yearlyRevenue } = useQuery(
        ['yearlyRevenue', '2024'], // Query Key: ['yearlyRevenue', year]
        () => fetchYearlyRevenue('2024') // Hàm gọi API với tham số `year`
    );

    // Query cho doanh thu theo ngày (cần cung cấp tham số `date`)
    const { data: dailyRevenue } = useQuery(
        ['dailyRevenue', '2024-12-12'], // Query Key: ['dailyRevenue', date]
        () => fetchDailyRevenue('2024-12-12') // Hàm gọi API với tham số `date`
    );

    // Query cho doanh thu theo tháng (cần cung cấp tham số `year`)
    const { data: monthlyRevenue } = useQuery(
        ['monthlyRevenue', '2024'], // Query Key: ['monthlyRevenue', year]
        () => fetchMonthlyRevenue('2024') // Hàm gọi API với tham số `year`
    );

    // Query cho doanh thu theo danh mục
    const { data: revenueByCategory } = useQuery(['revenueByCategory'], fetchRevenueByCategory);

    // Query cho thống kê đơn hàng
    const { data: orderStats } = useQuery(['orderStats'], fetchOrderStats);

    // Query cho sản phẩm đã bán
    const { data: soldProducts } = useQuery(['soldProducts'], fetchSoldProducts);

    // Tính tổng số sản phẩm đã bán
    const totalSoldProducts = soldProducts?.success && Array.isArray(soldProducts.data)
        ? soldProducts.data.reduce((total, item) => total + (parseInt(item.total_sold || "0") || 0), 0) // Đảm bảo parse chính xác
        : 0;

    // Xử lý dữ liệu doanh thu theo danh mục để hiển thị tên và doanh thu của từng danh mục
    const categoryRevenueList = revenueByCategory?.data?.map(category => ({
        categoryName: category.category_name,
        revenue: category.total_revenue
    })) || [];

    return {
        totalRevenue,
        bestSellers,
        yearlyRevenue,
        dailyRevenue,
        monthlyRevenue,
        revenueByCategory: categoryRevenueList, // Cập nhật để hiển thị tên và doanh thu danh mục
        orderStats,
        soldProducts,
        totalSoldProducts, // Hiển thị tổng số sản phẩm đã bán
    };
};
