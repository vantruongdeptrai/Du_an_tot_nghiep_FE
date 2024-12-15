import { useState } from "react";
import SingleStats from "./SingleStats";
import CountUp from "react-countup";

interface StatsProps {
    totalRevenue: { total_revenue: string };
    bestSellers: { success: boolean; data: Array<{ total_sold: string }> };
    yearlyRevenue: number | undefined;
    dailyRevenue: number | undefined;
    monthlyRevenue: number | undefined;
    revenueByCategory: Array<{ category_name: string; revenue: number }> | undefined;
    orderStats: Array<{ status_order: string; total: number }>; // Cập nhật kiểu dữ liệu của orderStats
    soldProducts: Array<{ product_name: string; total_sold: number }> | undefined;
    totalSoldProducts: number;
}

const Stats = ({
    totalRevenue = { total_revenue: "0" },
    bestSellers = { success: false, data: [] },
    yearlyRevenue = 0,
    dailyRevenue = 0,
    monthlyRevenue = 0,
    revenueByCategory = [],
    orderStats = [], // Dữ liệu mới
    soldProducts = [],
    totalSoldProducts,
}: StatsProps) => {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const revenueNumber = parseFloat(totalRevenue.total_revenue) || 0;

    const totalBestSellers =
        bestSellers.success && Array.isArray(bestSellers.data)
            ? bestSellers.data.reduce((total, item) => total + parseInt(item.total_sold || "0"), 0)
            : 0;

    // Tính tổng doanh thu theo danh mục
    const totalRevenueByCategory = revenueByCategory.reduce((total, item) => total + item.revenue, 0);

    // Tính tổng số đơn hàng từ tất cả các trạng thái
    const totalOrders = orderStats.reduce((total, item) => total + item.total, 0);

    return (
        <div>
            <h2 className="text-3xl text-whiteSecondary font-bold mb-7">Balance Overview</h2>
            <div className="mb-5 flex flex-row gap-2">
                <label htmlFor="">Chọn ngày:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-2 border rounded-md"
                />
            </div>
            <div className="flex justify-start gap-x-20 max-[1800px]:flex-wrap gap-y-10 mr-1 max-[1352px]:gap-x-10 max-[1050px]:mr-5">
                {/* Hiển thị tổng doanh thu */}

                <SingleStats
                    title="Tổng doanh thu"
                    value={<CountUp start={0} end={revenueNumber} duration={2.5} suffix=" VNĐ" separator="," />}
                />

                {/* Hiển thị tổng số lượng sản phẩm bán chạy */}
                <SingleStats
                    title="Sản phẩm bán chạy"
                    value={<CountUp start={0} end={totalBestSellers} duration={1} suffix=" sản phẩm" separator="," />}
                />

                {/* Hiển thị doanh thu theo năm
        <SingleStats
          title="Doanh thu theo năm"
          value={
            <CountUp
              start={0}
              end={yearlyRevenue}
              duration={2.5}
              suffix=" VNĐ"
              separator=","
            />
          }
        /> */}

                {/* Hiển thị doanh thu theo ngày
        <SingleStats
          title="Doanh thu hôm nay"
          value={
            <CountUp
              start={0}
              end={dailyRevenue}
              duration={2.5}
              suffix=" VNĐ"
              separator=","
            />
          }
        /> */}

                {/* Hiển thị doanh thu theo tháng
        <SingleStats
          title="Doanh thu tháng này"
          value={
            <CountUp
              start={0}
              end={monthlyRevenue}
              duration={2.5}
              suffix=" VNĐ"
              separator=","
            />
          }
        /> */}

                {/* Hiển thị doanh thu theo danh mục */}
                <SingleStats
                    title="Doanh thu theo danh mục"
                    value={
                        <CountUp start={0} end={totalRevenueByCategory} duration={2.5} suffix=" VNĐ" separator="," />
                    }
                />

                {/* Hiển thị tổng số đơn hàng */}
                <SingleStats
                    title="Tổng số đơn hàng"
                    value={
                        <CountUp
                            start={0}
                            end={totalOrders} // Sử dụng tổng số đơn hàng từ `orderStats`
                            duration={2.5}
                            separator=","
                        />
                    }
                />

                {/* Hiển thị tổng số sản phẩm đã bán */}
                <SingleStats
                    title="Tổng sản phẩm đã bán"
                    value={
                        <CountUp start={0} end={totalSoldProducts} duration={2.5} separator="," suffix=" sản phẩm" />
                    }
                />
            </div>
        </div>
    );
};

export default Stats;
