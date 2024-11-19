import { Chart, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useAppSelector } from "../../hooks";
import { useStats } from "../../hooks/useStatistical";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineGraph = () => {
    const { darkMode } = useAppSelector((state) => state.darkMode);
    // Khởi tạo state để lưu trữ năm đã chọn
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

    // Sử dụng react-query để lấy dữ liệu doanh thu theo tháng
    const { fetchMonthlyRevenue } = useStats();
    const { data, isLoading, isError } = useQuery(
        ["monthlyRevenue", selectedYear],
        () => fetchMonthlyRevenue(selectedYear) // Truyền năm vào hàm fetchMonthlyRevenue
    );

    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    if (isError) return <div>Đã xảy ra lỗi khi lấy dữ liệu</div>;

    // Kiểm tra xem dữ liệu có phải là mảng không và có chứa key revenues không
    const revenues = data?.revenues;
    const isDataArray = Array.isArray(revenues);
    if (!isDataArray) {
        return <div>Dữ liệu không hợp lệ</div>;
    }

    // Xử lý dữ liệu tháng và doanh thu từ API
    const labels = revenues.map((item: { month: number }) => `Tháng ${item.month}`);

    // Giới hạn doanh thu tối đa là 20 triệu VND (20,000,000)
    const maxRevenue = 20000000; // 20 triệu VND
    const revenueData = revenues.map((item: { revenue: string }) => {
        const revenue = parseFloat(item.revenue);
        return revenue > maxRevenue ? maxRevenue : revenue; // Giới hạn doanh thu
    });

    // Cập nhật màu sắc cho biểu đồ dựa trên chế độ tối/ sáng
    if (darkMode) {
        ChartJS.defaults.color = "#fff";
        ChartJS.defaults.backgroundColor = "#fff";
        ChartJS.defaults.borderColor = "#fff";
    } else {
        ChartJS.defaults.color = "#000";
        ChartJS.defaults.backgroundColor = "#000";
        ChartJS.defaults.borderColor = "#000";
    }

    // Dữ liệu cho biểu đồ
    const chartData = {
        labels, // Sử dụng tháng làm nhãn
        datasets: [
            {
                label: "Doanh thu",
                width: "80%",
                data: revenueData, // Dữ liệu doanh thu
                borderColor: "#42a5f5", // Màu đường biểu đồ
                backgroundColor: "rgba(66, 165, 245, 0.2)", // Màu nền cho vùng dưới đường biểu đồ
                fill: true, // Điền màu dưới đường
                tension: 0.4, // Làm mềm đường biểu đồ
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true, // Giữ tỷ lệ khung hình mặc định của biểu đồ
        plugins: {
            title: {
                display: true,
                text: `Doanh thu theo tháng (${selectedYear})`, // Hiển thị năm trong tiêu đề
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return context.raw.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        });
                    },
                },
            },
            datalabels: {
                display: true,
                align: "top",
                formatter: (value: number) => {
                    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
                },
                font: {
                    weight: "bold",
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: maxRevenue,
                ticks: {
                    callback: function (value: any) {
                        return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
                    },
                },
            },
        },
    };

    // Hàm xử lý khi người dùng chọn năm mới
    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div>
            {/* Select input để chọn năm */}
            <select className="py-2 px-5" value={selectedYear} onChange={handleYearChange}>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                {/* Thêm các năm khác nếu cần */}
            </select>
            {/* Biểu đồ */}
            <div className="w-[1000px]">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default LineGraph;
