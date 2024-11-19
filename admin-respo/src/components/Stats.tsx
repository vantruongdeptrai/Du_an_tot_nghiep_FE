import SingleStats from "./SingleStats";
import CountUp from "react-countup";

interface StatsProps {
  totalRevenue: { total_revenue: string }; // `total_revenue` là chuỗi
  bestSellers: { success: boolean; data: Array<{ total_sold: string }> }; // bestSellers có dạng object chứa success và data
}

const Stats = ({ totalRevenue = { total_revenue: "0" }, bestSellers = { success: false, data: [] } }: StatsProps) => {
  // Chuyển đổi revenue từ chuỗi sang số
  const revenueNumber = parseFloat(totalRevenue.total_revenue) || 0;

  // Kiểm tra nếu bestSellers có dữ liệu và tính tổng số lượng sản phẩm bán được
  const totalBestSellers = bestSellers.success && Array.isArray(bestSellers.data)
    ? bestSellers.data.reduce((total, item) => total + parseInt(item.total_sold || "0"), 0)
    : 0;

  return (
    <div>
      <h2 className="text-3xl text-whiteSecondary font-bold mb-7">Balance Overview</h2>
      <div className="flex justify-start gap-x-20 max-[1800px]:flex-wrap gap-y-10 mr-1 max-[1352px]:gap-x-10 max-[1050px]:mr-5">
        {/* Hiển thị doanh thu */}
        <SingleStats
          title="Revenue"
          value={<CountUp start={0} end={revenueNumber} duration={2.5} suffix=" VNĐ" separator="," />}
        />

        {/* Hiển thị tổng số lượng sản phẩm bán chạy */}
        <SingleStats
          title="Best Sellers"
          value={<CountUp start={0} end={totalBestSellers} duration={1} suffix=" sản phẩm" separator="," />}
        />
      </div>
    </div>
  );
};

export default Stats;
