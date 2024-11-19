import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useStats = () => {

    const fetchTotalRevenue = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/total-revenue");
            return response.data
        } catch (error) {
            console.error("Error fetching total revenue:", error);
        }
    };

    const fetchBestSellers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/products/best-sellers");
            return response.data
        } catch (error) {
            console.error("Error fetching best sellers:", error);
        }
    };

    const fetchYearlyRevenue = async (year: string) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revenue/year?year=${year}`);
            return response.data
        } catch (error) {
            console.error("Error fetching yearly revenue:", error);
        }
    };

    const fetchDailyRevenue = async (date: string) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revenue/day?date=${date}`);
            return response.data
           
        } catch (error) {
            console.error("Error fetching daily revenue:", error);
        }
    };

    const fetchMonthlyRevenue = async (year: string) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revenue/months?year=${year}`);
            return response.data
            
        } catch (error) {
            console.log("Error fetching monthly revenue: ", error);
            
        }
    }

    

    const {data: totalRevenue} = useQuery(
        ['totalRevenue'],
        fetchTotalRevenue
    )
    const {data: bestSellers} = useQuery(
        ['bestSellers'],
        fetchBestSellers
    )
    // const {data: yearlyRevenue} = useQuery(
    //     ['yearlyRevenue', year],
    //     fetchYearlyRevenue(year)
    // )
    // const {data: dailyRevenue} = useQuery(
    //     ['dailyRevenue', date],
    //     fetchDailyRevenue(date)
    // )

    return {
        totalRevenue,
        bestSellers,
        fetchYearlyRevenue,
        fetchDailyRevenue,
        fetchMonthlyRevenue
    };
};
