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
import { useState } from "react";
import Loader from "../loader/Loader";
import { useQueryTotalRevenueDailyLine } from "../../hooks/useStatis";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineGraphRevenueDaily = () => {
    const { darkMode } = useAppSelector((state) => state.darkMode);
    // Khởi tạo state để lưu trữ năm đã chọn
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());

    // Sử dụng react-query để lấy dữ liệu doanh thu theo tháng
    const { data: dailyRevenue, isLoading, isError } = useQueryTotalRevenueDailyLine(selectedMonth, selectedYear);
    console.log(dailyRevenue);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2022 + 1 }, (_, index) => (2023 + index).toString());
    const months = Array.from({ length: 12 }, (_, index) => (index + 1).toString());

    if (isLoading)
        return (
            <div>
                <Loader />
            </div>
        );
    if (isError) return <div>Đã xảy ra lỗi khi lấy dữ liệu</div>;

    // Kiểm tra xem dữ liệu có phải là mảng không và có chứa key revenues không
    const revenues = dailyRevenue?.data;
    const isDataArray = Array.isArray(revenues);
    if (!isDataArray) {
        return <div>Dữ liệu không hợp lệ</div>;
    }

    // Xử lý dữ liệu tháng và doanh thu từ API
    const labels = revenues.map((item: { date: string }) => {
        const day = new Date(item.date).getDate(); // Lấy ngày từ trường 'date'
        return day.toString(); // Hiển thị chỉ số ngày mà không có "Ngày"
    });

    // Giới hạn doanh thu tối đa là 50 triệu VND (50,000,000)
    const maxRevenue = 50000000; // 50 triệu VND
    const revenueData = revenues.map((item: { total_revenue: string | number }) => {
        return parseFloat(item.total_revenue.toString()); // Chuyển doanh thu sang số
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
                label: "Đường viền doanh thu",
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
                text: `Doanh thu theo tháng (${selectedMonth}/${selectedYear})`, // Hiển thị năm trong tiêu đề
                font: {
                    size: 20, // Thay đổi kích thước chữ (càng lớn càng to)
                    weight: "bold", // Đậm chữ
                },
            },
            legend: {
                labels: {
                    font: {
                        size: 14, // Kích thước chữ của các label trong legend
                        weight: "normal", // Đậm chữ của label trong legend
                    },
                },
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

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <div>
            <div className="flex gap-10">
                <div className="flex flex-col w-[20%]">
                    <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
                        Chọn tháng:
                    </label>
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        {months.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col w-[40%]">
                    <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white">Chọn năm:</label>
                    <select
                        id="default"
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="bg-gray-50 border w-full border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Biểu đồ */}
            <div className="w-[1000px]">
                <Line data={chartData} options={options} />
                <div className="flex items-center justify-center text-sm">(Ngày trong tháng)</div>
            </div>
        </div>
    );
};

export default LineGraphRevenueDaily;
