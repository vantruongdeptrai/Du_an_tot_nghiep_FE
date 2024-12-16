import { useState } from "react";
import SingleStats from "./SingleStats";
import CountUp from "react-countup";
import {
    useQueryTotalOrderDaily,
    useQueryTotalRevenueDay,
    useQueryTotalRevenueProductSold,
    useQueryTotalStatusOrderDaily,
} from "../hooks/useStatis";
import { FaBoxOpen, FaCircleCheck, FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaClipboardList, FaTimesCircle } from "react-icons/fa";

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
interface StatusOrder {
    order_date: string;
    status: string;
    total: number;
}

const Stats = ({
    totalRevenue = { total_revenue: "0" },
    bestSellers = { success: false, data: [] },
    revenueByCategory = [],
    orderStats = [], // Dữ liệu mới
    totalSoldProducts,
}: StatsProps) => {
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
    // const { data: totalOrderSold } = useQueryTotalOrderDaily(selectedDate);
    const { data: totalRevenueDaily } = useQueryTotalRevenueDay(selectedDate);
    const { data: totalStatusOrderDaily } = useQueryTotalStatusOrderDaily(selectedDate);
    const { data: totalProductSold } = useQueryTotalRevenueProductSold(selectedDate);
    const totalProductSoldDay = Array.isArray(totalProductSold)
        ? totalProductSold.reduce((acc, item) => acc + (item.total_sold || 0), 0)
        : 0;
    console.log(totalProductSoldDay);

    const pendingdOrders =
        totalStatusOrderDaily
            ?.filter((item: StatusOrder) => item.status === "Chờ xác nhận")
            .reduce((total: number, item: StatusOrder) => total + item.total, 0) || 0;

    const totaldOrders =
        totalStatusOrderDaily
            ?.filter((item: StatusOrder) => item.status)
            .reduce((total: number, item: StatusOrder) => total + item.total, 0) || 0;

    const canceledOrders =
        totalStatusOrderDaily
            ?.filter((item: StatusOrder) => item.status === "Đã hủy")
            .reduce((total: number, item: StatusOrder) => total + item.total, 0) || 0;

    const completedOrders =
        totalStatusOrderDaily
            ?.filter((item: StatusOrder) => item.status === "Giao hàng thành công")
            .reduce((total: number, item: StatusOrder) => total + item.total, 0) || 0;

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
            <div className="mb-5 flex flex-row items-center gap-2">
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
                    title="Tổng doanh thu ngày"
                    value={
                        <CountUp
                            style={{ fontSize: 18, fontWeight: "normal" }}
                            start={0}
                            end={totalRevenueDaily}
                            duration={2.5}
                            suffix=" VNĐ"
                            separator=","
                        />
                    }
                    icon={<FaMoneyBillTrendUp className="text-3xl text-blue-400" />}
                />

                <SingleStats
                    title="Đơn hàng đã đặt"
                    value={
                        <CountUp
                            style={{ fontSize: 18, fontWeight: "normal" }}
                            start={0}
                            end={totaldOrders}
                            duration={2.5}
                            suffix=" đơn"
                            separator=","
                        />
                    }
                    icon={<FaBoxOpen className="text-3xl text-blue-400" />}
                />
                {/* Hiển thị tổng số sản phẩm đã bán */}
                <SingleStats
                    title="Tổng sản phẩm đã bán"
                    value={
                        <CountUp
                            style={{ fontSize: 18, fontWeight: "normal" }}
                            start={0}
                            end={totalProductSoldDay} // Sử dụng tổng số đơn hàng từ `orderStats`
                            duration={2.5}
                            suffix=" sản phẩm"
                        />
                    }
                    icon={<FaClipboardList className="text-3xl text-orange-300" />}
                />
                <SingleStats
                    title="Đơn hàng đang chờ xử lý"
                    value={
                        <CountUp
                            style={{ fontSize: 18, fontWeight: "normal" }}
                            start={0}
                            end={pendingdOrders}
                            duration={2.5}
                            suffix=" đơn"
                            separator=","
                        />
                    }
                    icon={<FaBoxOpen className="text-3xl text-blue-400" />}
                />

                {/* Hiển thị doanh thu theo danh mục */}
                <SingleStats
                    title="Đơn hàng đã giao"
                    value={
                        <CountUp
                            style={{ fontSize: 18, fontWeight: "normal" }}
                            start={0}
                            end={completedOrders}
                            duration={2.5}
                            suffix=" đơn"
                            separator=","
                        />
                    }
                    icon={<FaCircleCheck className="text-3xl text-green-400" />}
                />

                {/* Hiển thị tổng số đơn hàng */}
                <SingleStats
                    title="Đơn hàng đã bị hủy"
                    value={
                        <CountUp
                            style={{ fontSize: 18, fontWeight: "normal" }}
                            start={0}
                            end={canceledOrders} // Sử dụng tổng số đơn hàng từ `orderStats`
                            duration={2.5}
                            suffix=" đơn"
                        />
                    }
                    icon={<FaTimesCircle className="text-3xl text-red-400" />}
                />
            </div>
        </div>
    );
};

export default Stats;
