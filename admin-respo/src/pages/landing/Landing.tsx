import {
  ActivitiesByCountry,
  ActivitiesByDevices,
  ActivityByTime,
  ConversionRateBySource,
  Sidebar,
  Stats,
  Welcome,
} from "../../components";
import { BarChart, LineGraph, PieChart } from "../../components/chart";
import { useStats } from "../../hooks/useStatistical";

const Landing = () => {
  // Lấy dữ liệu từ hook useStats
  const { totalRevenue, bestSellers, totalSoldProducts, orderStats } =
    useStats();

  console.log(bestSellers?.data); // Gỡ lỗi: kiểm tra thông tin bestSellers

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full pt-6 pl-9 max-sm:pt-6 max-sm:pl-5 flex max-[2000px]:flex-wrap gap-x-10 max-[400px]:pl-2">
        <div>
          <div>
            <Welcome>
              {/* <Welcome.Title>Good evening, Sherwood 😀</Welcome.Title> */}
              <Welcome.Description>Biểu đồ thống kê</Welcome.Description>
            </Welcome>
            {/* Truyền cả totalRevenue, bestSellers, totalSoldProducts và orderStats vào Stats */}
            <Stats
              totalRevenue={totalRevenue}
              bestSellers={bestSellers}
              totalSoldProducts={totalSoldProducts} // Truyền thêm tổng số sản phẩm đã bán
              orderStats={orderStats} // Truyền thêm tổng số đơn hàng
            />
          </div>

          {/* Tổng quan chiến dịch */}
          <div className="sm:w-[66%] mt-10 max-sm:w-[80%]">
            <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
              Tổng quan chiến dịch
            </h3>
            <LineGraph />
          </div>

          {/* Tổng quan đơn hàng */}
          {/* <div className="sm:w-[66%] mt-10 max-sm:w-[80%]">
            <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
              Tổng quan đơn hàng
            </h3>
            <BarChart />
          </div> */}

          {/* Đoạn code sau bị comment lại */}
          {/* <div className="sm:w-[50%] mt-10 max-sm:w-[70%]">
            <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
              Source Overview
            </h3>
            <PieChart />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Landing;
