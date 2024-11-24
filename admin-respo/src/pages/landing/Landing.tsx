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
    const {totalRevenue, bestSellers} = useStats();
    console.log(bestSellers?.data);
    
    
    return (
        <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="dark:bg-blackPrimary bg-whiteSecondary w-full pt-6 pl-9 max-sm:pt-6 max-sm:pl-5 flex max-[2000px]:flex-wrap gap-x-10 max-[400px]:pl-2">
                <div>
                    <div>
                        <Welcome>
                            <Welcome.Title>Good evening, Sherwood 😀</Welcome.Title>
                            <Welcome.Description>
                                Biểu đồ thống kê
                            </Welcome.Description>
                        </Welcome>
                        <Stats totalRevenue={totalRevenue} bestSellers={bestSellers} />
                    </div>
                    <div className="sm:w-[66%] mt-10 max-sm:w-[80%]">
                        <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
                            Traffic Overview
                        </h3>
                        <LineGraph />
                    </div>
                    <div className="sm:w-[66%] mt-10 max-sm:w-[80%]">
                        <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
                            Orders Overview
                        </h3>
                        <BarChart />
                    </div>
                    <div className="sm:w-[50%] mt-10 max-sm:w-[70%]">
                        <h3 className="text-3xl dark:text-whiteSecondary text-blackPrimary font-bold mb-7 max-sm:text-2xl">
                            Source Overview
                        </h3>
                        <PieChart />
                    </div>
                </div>
                
            </div>
        </div>
    );
};
export default Landing;
